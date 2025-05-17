# DefenderForChrome

Chrome Plugin for additional security. 

* File download whitelist/blacklist
* Copy text blacklist ("powershell.exe" and more)


## Purpose

Chrome does not implement a fine-grained file download whitelist. 
This plugin allows coorporate environments to implement a file
download policy on the browser. Allowed file extensions 
are defined in `file-whitelist.json`.

With the policy in the browser, it is not required to have a
content-filter in between, for example when moving towards 
zero trust. 

This makes it harder for attackers to gain initial access with
common files like `.js`, `.vbs`, `.exe` etc.

There is also a clipboard blacklist against the commonly
used "press win-r, paste and enter" with copied powershell
commands. The `clipboard-blacklist.json` contains a list 
of obviously malicious strings. 


## Installation for testing

1) Open chrome://extensions
2) Enable "Developer mode"
3) Click "Load unpacked" and select this git repo directory


## Configuration

* file-whitelist.json: Define allowed file extensions here
* clipboard-blacklist.json: Define prohibited words here

Both are case insensitive.


## Dev Stuff

### Chrome Plugin Permissions

* `notifications`: Show notifications to the user
* `downloads`: Access downloads
* `scripting`, `activeTab`: Inject Clipboard protection
* `storage`: Access whitelists/blacklists
* `web_accessible_resources`: Clipboard blacklist data access


### File Download Filtering

Implemented in background.js.

Using chrome functionality. 


### Clipboard Filtering

Implemented in content.js. 

Injected into every page. 
