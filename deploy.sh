#!/bin/bash
npm run build
rsync -a ./build/ root@node.pymnts.com:/var/www/whisper.pymnts.com/