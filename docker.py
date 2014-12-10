#!/usr/bin/python

from __future__ import print_function # Python 3 compatibility
import argparse
import subprocess
import traceback
import shlex
import sys
import socket

class bcolors:
    GRAY = '\033[97m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'

def parse_args():
    """Parse CLI arguments"""
    parser = argparse.ArgumentParser(description='Build and runs a docker container for this project.')
    parser.add_argument('action', choices=['build', 'run'],
                       help='the docker action')
    parser.add_argument('--mongodb-container', default='mongo', type=str,
                       help='the container name or id of the mongodb docker instance')
    parser.add_argument('--mongodb-port', default=27017, type=int,
                       help='the mongodb port number')
    parser.add_argument('--mongodb-db', default='patterncatalog', type=str,
                       help='the mongodb database name')
    parser.add_argument('--tag', default='patterncatalog/api:latest', type=str,
                       help='the repository and (optionally) tag')
    parser.add_argument('--name', default='patterncatalog', type=str,
                       help='the running container name')
    return vars(parser.parse_args())

def get_platform():
    """Returns either 'linux', 'mac' or 'unknown'"""
    if sys.platform.startswith('linux'):
        return 'linux'
    elif sys.platform.startswith('darwin'):
        return 'mac'
    else:
        return 'unknown'

def get_mongodb_ip(mongodb_container):
    """Returns the IP address of the mongodb container"""
    command = "docker inspect --format '{{ .NetworkSettings.IPAddress }}' " + mongodb_container
    output = subprocess.check_output(command, shell=True)
    try:
        socket.inet_aton(output)
        return output.rstrip()
    except:
        sys.exit('Unable to find mongodb container {}'.format(mongodb_container))

def action_run(args):
    """Runs docker image"""

    # OSX requires boot2docker to be up and running
    if get_platform() == 'mac':
        command = 'which boot2docker'
        process = subprocess.Popen(shlex.split(command), stdout=subprocess.PIPE)
        process.communicate()
        exit_status = process.wait()
        if exit_status > 0:
            sys.exit('Unable to find boot2docker executable')

        # The following has NOT been tested yet! (don't have a mac)
        boot2docker_status = subprocess.call('boot2docker status', shell=True)
        if boot2docker_status != 'running':
            print(subprocess.call('boot2docker up', shell=True))
            print(subprocess.call('$(boot2docker shellinit)', shell=True))

    mongodb_url = "mongodb://{0}:{1}/{2}".format(get_mongodb_ip(args['mongodb_container']), args['mongodb_port'], args['mongodb_db'])
    cmd = "docker run -p 3000:3000 -d -t --name {0} -e mongodb_url={1} {2}".format(args['name'], mongodb_url, args['tag'])
    print(cmd)
    subprocess.call(cmd, shell=True)

def action_build(args):
    """Builds docker image"""
    command = 'docker build -t="{}" .'.format(args['tag'])
    print(command)
    ls_output = subprocess.call(command, shell=True)
    print(ls_output)

def main():
    if get_platform() == 'unknown':
        sys.exit('OS {} is not supported'.format(sys.platform))
    args = parse_args()
    actions = {
        'build': action_build,
        'run': action_run
    }
    try:
        actions[args['action']](args)
    except Exception as e:
        print(bcolors.RED, 'Error:', e, bcolors.ENDC)
        traceback.print_exc()

if __name__ == "__main__":
    main()
