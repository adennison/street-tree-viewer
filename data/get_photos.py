import csv
import os

with open('/home/andrew/workspace/trees.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	for row in reader:
		server = 'gaia@gaiabdrs.gaiaresources.com.au'
		path = '/data/filestores/gaiabdrs/bdrs_core_filestore/au/com/gaiaresources/bdrs/model/taxa/AttributeValue/' + row[0] + '/' + row[1]
		target = '/home/andrew/workspace/street-tree-viewer/data/images/' + row[1]
		os.system('scp "%s" "%s:%s"' % (target, server, path))


os.system('scp "%s" "%s:%s"' % (localfile, remotehost, remotefile) )
gaia@gaiabdrs.gaiaresources.com.au
