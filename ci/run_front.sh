
#!/bin/bash
set -e
npm run serve --prefix ./frontend &
echo " Waiting for App to be up at http://localhost:8080"
echo
while ! curl -f -s -o /dev/null "http://localhost:8080"
do
    echo -ne ". "
    sleep 5
done
echo -ne " Let's go!"