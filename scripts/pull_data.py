# python script to version the google sheet
import json
import os

from pyairtable import Table
from helpers import files
from helpers.utils import get_project_root
from helpers.sprites import create_sprites

archive_targets = ['Tools']


def archive_airtable(table, table_name, base, csv_dir, md_dir, api_key):
	table = Table(api_key, base, table)

	# make directories if they don't exist
	try:
		os.mkdir(md_dir)
	except FileExistsError:
		print('found markdown dir')
	except:
		print('something went wrong')

	try:
		os.mkdir(csv_dir)
	except FileExistsError:
		print('found csv dir')
	except:
		print('something went wrong')

	# set up csv output
	name=table_name.replace(" ", "_")
	filename = os.path.join(csv_dir, f"{name}.csv")
	md_path = os.path.join(get_project_root(), md_dir)

	data = []
	for row in table.all():
		entry = {}
		entry["uuid"] = row["id"]
		for key, value in row["fields"].items():
			new_key = key.replace(" ", "_").lower()
			entry[new_key] = value
		data.append(entry)

	print(table.all(), filename)

	files.write_csv(data, filename)
	new_files = files.generate_markdown(data, md_path)
	create_sprites(new_files)
	files.update_markdown(data, md_path)



if __name__ == "__main__":
	api_key = os.environ.get("INPUT_CREDS")
	base = os.environ.get("BASE_ID")
	table = os.environ.get("TABLE_ID")
	table_name = os.environ.get("TABLE_NAME")
	csv_dir = os.environ.get("ARCHIVE_DIR")
	md_dir = os.environ.get("FILES_DIR")

	try:
		csv_dir = os.path.join(get_project_root(), csv_dir)
	except TypeError:
		print('hit exception: could not find csv directory in environment. Try exporting the environment variables.')
		exit()

	try:
		md_dir = os.path.join(get_project_root(), md_dir)
	except TypeError:
		print('hit exception: could not find markdown directory in environment. Try exporting the environment variables.')
		exit()

	archive_airtable(
		table=table,
		table_name=table_name,
		base=base,
		csv_dir=csv_dir,
		md_dir=md_dir,
		api_key=api_key,
	)
