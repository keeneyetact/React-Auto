import os
import requests
import base64
import imgkit
from datetime import datetime
from pytz import timezone, utc


import threading
import queue

from log import app_log
from dbMongo import dbUpdateHistory

try:
    AH_DEBUG = bool(os.environ['AH_DEBUG'])
except:
    AH_DEBUG = False

try:
    AH_TZ = os.environ['AH_TZ']
    localtz = timezone(AH_TZ)
except:
    localtz = None

try:
    SIGNAL_CLI_REST_API_PORT = os.environ['SIGNAL_CLI_REST_API_PORT']
except:
    print("SIGNAL_CLI_REST_API_PORT not defined, defaulting to port 8000")
    app_log.warning(
        "SIGNAL_CLI_REST_API_PORT not defined, defaulting to port 8000")
    SIGNAL_CLI_REST_API_PORT = str(8000)

try:
    SIGNAL_ACC_NUMBER = os.environ['SIGNAL_ACC_NUMBER']
    SIGNAL_ACC_NUMBER = SIGNAL_ACC_NUMBER.replace('+', '%2B')
    SIGNAL_CLI_REST_ENDPOINT = 'http://127.0.0.1:' + \
        SIGNAL_CLI_REST_API_PORT+'/messages/'+SIGNAL_ACC_NUMBER
    print(SIGNAL_CLI_REST_ENDPOINT)
    app_log.info(SIGNAL_CLI_REST_ENDPOINT)
except:
    print("Signal account number not configured!")
    print("Signal notifications will not be sent")
    app_log.warning("Signal account number not configured!")
    app_log.warning("Signal notifications will not be sent")
    SIGNAL_CLI_REST_ENDPOINT = ''

q = queue.Queue()


def composeEmailBody(userNotifyDict, sent_time):
    body = ""
    for area in userNotifyDict:
        if("=" in area):
            displayArea = area.replace("=", " > ")
        else:
            displayArea = area
        if(body == ""):
            # Header for chat message
            body = body + \
                "<span style=\"font-size: 1.5em;\"><b>Alarm Notification: "+sent_time+"</b></span> \
                <br/> \
                <br/>"
            #
            if(not localtz):
                body = body + \
                    "<span style=\"font-size: 0.875em;\"><b>**WARNING**</b></span> \
                    <br/> \
                    <span style=\"font-size: 0.875em;\">Local timezone for alarm handler not set. All times shown are timezone UTC.</span> \
                    <br/> \
                    <br/>"
            body = body + \
                "<table> \
                <tr> \
                <th colspan=\"4\" style=\"text-align: left\">"+displayArea+"</th> \
                </tr>"
        else:
            body = body + \
                "<tr><td>"+" "+"</td></tr> \
                <tr> \
                <th colspan=\"4\" style=\"text-align: left\">"+displayArea+"</th> \
                </tr>"
        for pvname in userNotifyDict[area]:
            for item in userNotifyDict[area][pvname]:
                timestamp = item["timestamp"]
                entry = item["entry"]
                message = entry.split(pvname+' - ')[1]
                if("DISCONNECTED" in message):
                    formattedAlarm = "<span><b style=\"background-color:rgb(198,40,40); color:rgb(255,255,255); padding:2;\">DISCONNECTED</b></span>"
                    shortMessage = ""
                else:
                    alarm, shortMessage = message.split(" triggered, ")
                    if("MINOR_ALARM" in message):
                        formattedAlarm = "<span><b style=\"background-color:rgb(255,138,101); color:rgb(255,255,255); padding:2;\">" + \
                            alarm+"</b></span>"
                    else:
                        formattedAlarm = "<span><b style=\"background-color:rgb(198,40,40); color:rgb(255,255,255); padding:2;\">" + \
                            alarm+"</b></span>"
                # Time zone localisation
                if(localtz):
                    str_time = datetime.fromisoformat(timestamp).astimezone(localtz).strftime(
                        "%H:%M:%S %a, %d %b %Y")
                else:
                    str_time = datetime.fromisoformat(timestamp).strftime(
                        "%H:%M:%S %a, %d %b %Y")+" (UTC)"
                # Time zone localisation
                body = body + \
                    "<tr> \
                        <td><u>"+str_time+":</u>  "+"</td> \
                        <td><b>"+pvname+"</b></td> \
                        <td>"+formattedAlarm+"</td> \
                        <td>"+shortMessage+"</td> \
                    </tr>"

    body = body + \
        "</table>"

    if(localtz):
        body = body + \
            "<br/> \
            <span style=\"font-size: 0.875em;\">NOTE: All times shown are timezone "+AH_TZ+"</span>"
    else:
        body = body + \
            "<br/> \
            <span style=\"font-size: 0.875em;\"><b>**WARNING**</b></span> \
            <br/> \
            <span style=\"font-size: 0.875em;\">Local timezone for alarm handler not set. All times shown are timezone UTC.</span>"

    return """ \
            <html>
                <body>
                    {body}
                </body>
            </html>""".format(**locals())


def worker():
    while True:
        item = q.get()

        timestamp = item['timestamp']
        mobile = item['mobile']
        name = item['name']
        userNotifyDict = item['userNotifyDict']

        timestamp = datetime.fromisoformat(timestamp)

        app_log.info("###-SIGNAL NOTIFY-###")
        app_log.info(timestamp.strftime('%a, %d %b %Y at %H:%M:%S UTC'))
        app_log.info(mobile)
        # app_log.info(str(userNotifyDict))

        if(SIGNAL_CLI_REST_ENDPOINT != ''):
            try:
                # Time zone localisation
                if(localtz):
                    str_time = timestamp.astimezone(localtz).strftime(
                        '%a, %d %b %Y at %H:%M:%S')
                else:
                    str_time = timestamp.strftime(
                        '%a, %d %b %Y at %H:%M:%S')+" (UTC)"
                # Time zone localisation
                message = "You have new alarm notifications"
                message = message.replace(" ", "\ ")
                message.encode('unicode_escape')
                html = composeEmailBody(userNotifyDict, str_time)

                imgkit.from_string(html, 'alarms.jpg')

                with open("alarms.jpg", "rb") as image_file:
                    encoded_image = base64.b64encode(image_file.read())

                data = {
                    "text": message,
                    "receivers": [mobile],
                    "group": False,
                    "groupId": "",
                    "attachments": [
                        {
                            "url": "",
                            "filename": "alarms.jpg",
                            "content": encoded_image.decode()
                        }
                    ]
                }

                try:
                    r = requests.post(SIGNAL_CLI_REST_ENDPOINT, json=data)
                    app_log.info(
                        "Signal rest API response: [" + str(r.status_code)+"] "+r.reason)
                    if(r.ok):
                        timestamp = datetime.now(utc).isoformat()
                        entry = {"timestamp": timestamp, "entry": " ".join(
                            [name, "notified on Signal"])}
                except Exception as e:
                    app_log.error("Exception raised: " + str(e))
                    app_log.error("Exception type: " + str(type(e)))
                    app_log.error("Exception args: " + str(e.args))
                    print("Failed to send Signal message to",
                          mobile, ". Verify Signal settings.")
                    app_log.error("Failed to send Signal message to " +
                                  mobile + ". Verify Signal settings.")
                    timestamp = datetime.now(utc).isoformat()
                    entry = {"timestamp": timestamp, "entry": " ".join(
                        ["FAILED to notify", name, "on Signal!"])}
            except Exception as e:
                app_log.error("Exception raised: " + str(e))
                app_log.error("Exception type: " + str(type(e)))
                app_log.error("Exception args: " + str(e.args))
                print("Failed to send Signal message to",
                      mobile, ". Verify Signal settings.")
                app_log.error("Failed to send Signal message to " +
                              mobile + ". Verify Signal settings.")
                timestamp = datetime.now(utc).isoformat()
                entry = {"timestamp": timestamp, "entry": " ".join(
                    ["FAILED to notify", name, "on Signal!"])}
        else:
            print("Failed to send Signal message to",
                  mobile, ". Verify Signal settings.")
            app_log.error("Failed to send Signal message to " +
                          mobile + ". Verify Signal settings.")
            timestamp = datetime.now(utc).isoformat()
            entry = {"timestamp": timestamp, "entry": " ".join(
                ["FAILED to notify", name, "on Signal!"])}

        for area in userNotifyDict:
            for pvname in userNotifyDict[area]:
                dbUpdateHistory(area, entry, pvname)
        q.task_done()


# turn-on the worker thread
threading.Thread(target=worker, daemon=True).start()


def populateQueue(timestamp, mobile, name, userNotifyDict):
    item = {
        'timestamp': timestamp,
        'mobile': mobile,
        'name': name,
        'userNotifyDict': userNotifyDict
    }

    q.put(item)
    q.join()


def notifySignal(timestamp, mobile, name, userNotifyDict):
    threading.Thread(target=populateQueue, args=(
        timestamp, mobile, name, userNotifyDict,), daemon=True).start()
