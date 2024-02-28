from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By

from bs4 import BeautifulSoup

import time
import datetime
import calendar
import json

import mintotp
import configFile


def getTotp():
    code = mintotp.totp(configFile.TOTPSECRET)
    return code


def convertMonthTxtToNum(monthText):
    return list(calendar.month_abbr).index(monthText)


def d2lTimeStampToUnix(d2lDateString):
    try:
        split1 = d2lDateString.split(" ")
        month = convertMonthTxtToNum(split1[2])
        day = int(split1[3][:-1])
        year = int(split1[4])
        time12h = split1[5]
        AM = (split1[6] == "AM")
        time24h = time12h.split(":")
        if (AM == False):
            hour = int(time24h[0])+12
            minute = int(time24h[1])
        else:
            hour = int(time24h[0])
            minute = int(time24h[0])

        date_time = datetime.datetime(year, month, day, hour, minute)
        return time.mktime(date_time.timetuple())
    except:
        configFile.sendError("Error with Date Conversion")
        return None


def convertElementToArray(element, courseCode):
    try:
        soup = BeautifulSoup(element, features="html.parser")
        assignmentsArray = []
        for i in soup.find_all('tr')[2:]:
            # o = i.find('th')
            l = i.find_all('strong')
            if (len(l) > 1):
                if (l[1].encode_contents().decode("utf-8") == "Access restricted after availability ends."):
                    li = i.find_all('li')
                    stringystring = str(li[0]).split(">")[1][:-20]
                    assignmentsArray.append([courseCode, l[0].encode_contents().decode(
                        "utf-8"), d2lTimeStampToUnix(stringystring)])
                else:

                    assignmentsArray.append([courseCode, l[0].encode_contents().decode(
                        "utf-8"), d2lTimeStampToUnix(l[1].encode_contents().decode("utf-8"))])
        return assignmentsArray
    except:
        configFile.sendError("Error parsing soup on course: " + courseCode)
        return []


driver = webdriver.Firefox()
driver.get('https://elearning.nbcc.ca/')
wait = WebDriverWait(driver, 10)
try:
    try:
        wait.until(EC.element_to_be_clickable((By.ID, "i0116"))
                   ).send_keys(configFile.EMAIL, Keys.RETURN)
    except:
        configFile.sendError("Error with Email Box")

    try:
        wait.until(EC.element_to_be_clickable((By.ID, "i0118"))
                   ).send_keys(configFile.PASSWORD, Keys.RETURN)
    except:
        configFile.sendError("Error with Password Box")

    try:
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".row.tile:nth-child(2)"))).click()
        wait.until(
            EC.element_to_be_clickable((By.ID, "idTxtBx_SAOTCC_OTC"))).send_keys(getTotp(), Keys.RETURN)
    except:
        configFile.sendError("Error with TOTP")
    try:
        wait.until(
            EC.element_to_be_clickable((By.ID, "idSIButton9"))).click()
    except:
        configFile.sendError("Error with Checkbox")
    courseAssignments = []
    for i in configFile.COURSES:
        try:
            driver.get(
                'https://elearning.nbcc.ca/d2l/lms/dropbox/user/folders_list.d2l?ou=' + i + '&isprv=0')
            assignments = wait.until(
                EC.element_to_be_clickable((By.ID, "z_b"))).get_attribute("innerHTML")
            courseAssignments.extend(convertElementToArray(assignments, i))
        except:
            configFile.sendError("Error with course: " + str(i))
finally:
    driver.quit()

print(courseAssignments)
jsonString = "["
for i in courseAssignments:
    print(i)
    if (courseAssignments[len(courseAssignments)-1] != i):
        jsonString += '{"courseCode": "' + \
            str(i[0]) + '", "assessmentName": "'+str(i[1]) + \
            '", "unixTimestamp": "' + str(i[2]) + '"},'
    else:
        jsonString += '{"courseCode": "' + \
            str(i[0]) + '", "assessmentName": "'+str(i[1]) + \
            '", "unixTimestamp": "' + str(i[2]) + '"}'
jsonString += "]"

print(jsonString)


configFile.postAssignments(
    "http://localhost:3001/bulkAssignments", jsonString)

configFile.postCourses("http://localhost:3001/bulkCourses")
