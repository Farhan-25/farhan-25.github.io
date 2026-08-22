"""
Utility script to fetch the latest compiled PDF from Overleaf and update Resume.pdf.
Usage: python update_resume.py
"""

import time
import os
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def sync_resume():
    print("[*] Connecting to Overleaf project...")
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(options=chrome_options)
    try:
        driver.get('https://www.overleaf.com/read/bgwjthpmcpts#4ef6c7')
        print("[*] Compiling latest LaTeX source on Overleaf...")
        time.sleep(10)

        links = driver.find_elements('tag name', 'a')
        pdf_url = None
        for a in links:
            href = a.get_attribute('href')
            if href and 'output.pdf' in href:
                pdf_url = href
                break

        if not pdf_url:
            print("[-] Could not find compiled output.pdf link.")
            return

        print(f"[*] Found output PDF build: {pdf_url[:60]}...")
        b64 = driver.execute_async_script('''
            var uri = arguments[0];
            var callback = arguments[arguments.length - 1];
            fetch(uri)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    var binary = '';
                    var bytes = new Uint8Array(buffer);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    callback(window.btoa(binary));
                })
                .catch(err => callback('ERR: ' + err.toString()));
        ''', pdf_url)

        if b64 and not b64.startswith('ERR:'):
            data = base64.b64decode(b64)
            output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Resume.pdf')
            with open(output_path, 'wb') as f:
                f.write(data)
            print(f"[+] Successfully updated Resume.pdf ({len(data)} bytes) with latest Overleaf version!")
        else:
            print(f"[-] Failed to extract PDF: {b64}")
    finally:
        driver.quit()

if __name__ == '__main__':
    sync_resume()
