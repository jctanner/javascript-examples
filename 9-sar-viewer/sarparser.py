#!/usr/bin/env python3


class SarParser:
    def __init__(self, filename):
        self.filename = filename
        self._data = None
        self.load_file()

    @property
    def cpu(self):
        return self._data['cpu']
    
    @property
    def memfree(self):
        return self._data['memfree']
    
    @property
    def load(self):
        return self._data['load']
    
    def load_file(self):

        dd = {
            'uname': '',
        }

        sections = {
            'CPU': 'cpu',
            'proc/s': 'processes',
            'pspin/s': 'spin',
            'pgpgin/s': 'page',
            'tps': 'transfers',
            'frmpg/s': 'mpg',
            'kbmemfree': 'memfree',
            'kbswapfree': 'swapfree',
            'kphugfree': 'hugefree',
            'dentunusd': 'directory',
            'runq-sz': 'load',
            'TTY': 'tty',
            'DEV': 'dev',      
            'IFACE': 'iface',
            'call/s': 'rpc_out',
            'scall/s': 'rpc_in',
            'totsck': 'sockets',

        }

        with open(self.filename, 'r') as f:
            lines = f.readlines()
            section = None
            columns = None
            date = None
            for linecount, line in enumerate(lines):
                #print(line)
                if linecount == 0:
                    # Linux 3.10.0-862.2.3.el7.x86_64 (ansibullbot.eng.ansible.com) 	2020-05-24 	_x86_64_	(4 CPU)
                    parts = line.split()
                    dd['uname'] = line.strip()
                    date = parts[3]
                    continue
                if line.startswith('Average:'):
                    continue
                if line.strip():
                    parts = line.split()
                    timestamp = None
                    if line[0].isdigit():
                        timestamp = [date, parts[0], parts[1]]
                    
                    if parts[2] in sections:
                        section = sections[parts[2]]
                        if section not in dd:
                            dd[section] = []
                        columns = parts[2:]
                        continue

                    if section and columns:
                        ld = {'timestamp': timestamp}
                        for idp,part in enumerate(parts[2:]):
                            if '.' in part:
                                part = float(part)
                            elif part.isnumeric():
                                part = int(part)
                            ld[columns[idp]] = part
                            dd[section].append(ld)

        self._data = dd


if __name__ == "__main__":
    sp = SarParser('/tmp/sa/sar24')
    import epdb; epdb.st()    