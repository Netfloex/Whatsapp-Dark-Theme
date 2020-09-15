console.clear()
const { lookup, kill } = require('ps-node');
const { extractAll, createPackage } = require("asar");
const { join } = require("path");
const { exec } = require("child_process")
const copy = require('ncp').ncp;
const fs = require("fs")
const less = require("less")
log = console.log
var waPath, app
checkProcess()
lessToCss()
function lessToCss() {
    var lessFile = fs.readFileSync(join(__dirname, "less", "darkTheme.less")) + ''
    less.render(lessFile, {
        compress: true,
        paths: [
            join(__dirname, "less")
        ]
    }).then(output => {
        fs.writeFileSync(join(__dirname, "override", "custom", "darkTheme.css"), output.css)
        log("Rendered less")
    }, error => {
        console.error(error)
    })
}
function checkProcess() {
    log("Looking if whatsapp is running...")
    lookup({
        command: 'WhatsApp.exe',
        psargs: 'ux'
    }, (err, list) => {
        if (err) {
            console.error(err)
            return
        }
        if (list.length) {
            waPath = list[0].command
            app = join(waPath, "../resources", "app.asar")
            log("Killing whatsapp...")
            kill(list[0].pid, function (err) {
                if (err) {
                    log('Unable to kill WhatsApp. Please close WhatsApp manually.');
                    checkProcess();
                } else {
                    log(`Killed whatsapp, path: ${waPath}`)
                    startUnpack()
                }
            });

        } else {
            if (waPath) {
                startUnpack()
            } else {
                log("Please make sure whatsapp is running")
                checkProcess()
            }
        }
    })
}
function startUnpack() {
    if (!waPath) {
        checkProcess()
        return
    }
    if (!fs.existsSync(join(__dirname, "app"))) {
        unpack().then(overrideFiles)
    } else {
        overrideFiles()
    }
}
function unpack() {
    log("Unpacking...")
    return new Promise(async res => {
        await extractAll(app, join(__dirname, "app"))

        log("Unpacked whatsapp")
        res()
    })
}
function overrideFiles() {
    log("Copying files...")
    copy(join(__dirname, "override"), join(__dirname, "app"), function (err) {
        if (err) {
            return console.error(err);
        }
        log('Copied override files');
        repack().then(process.exit);

    });
}

function repack() {
    log("Repacking files...")
    return new Promise(async res => {
        await createPackage(join(__dirname, "app"), app);

        log("Repacked whatsapp")
        exec(waPath).unref();

        fs.rmdirSync(join(__dirname, "app"), { recursive: true })
        res()
    })
}
