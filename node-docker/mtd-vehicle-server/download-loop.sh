#!/bin/sh

set -eu

umask 077
if [ -w "${MD_LOGFILE:=/var/log/cumtd-download.log}" ]; then
	exec >>"$MD_LOGFILE"
fi
umask 022

mkdir -p "${PUBLIC_DIR:=public}"

I="1"

if [ "${MD_DEBUG:-}" != "debug" ] && command -v chronic >/dev/null 2>&1; then
	CHRONIC="chronic"
else
	CHRONIC=""
fi

cumtd_download() {
	umask 077
	set +e
	sed -n "${1}p" "${MTD_URLFILE:=url.txt}" | $CHRONIC wget -T 10 -nv -O /dev/fd/4 -i - 2>&3 4>&1 \
		| ifne sh -c 'tee "$1/.$2.json.tmp" | python3.5 -m json.tool > "$1/.$2.pp.json.tmp"' - "$PUBLIC_DIR" "$2"
	for x in '' '.pp'; do
		F="$PUBLIC_DIR/.$2$x.json.tmp"
		if [ -f "$F" ]; then
			chmod 644 "$F" && mv "$F" "$PUBLIC_DIR/$2$x.json"
		fi
	done
	set -e
}
while true; do
	if [ "$((I=I-1))" = "0" ]; then
		I=100
		cumtd_download 2 reroutes
	fi
	cumtd_download 1 vehicles
	sleep 35
done 3>&1 | sed -u 's/key=[0-9a-f]*/key=[REDACTED]/g'
