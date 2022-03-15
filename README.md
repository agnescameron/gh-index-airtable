# How to use this tool

This indexing tool is built entirely using open infrastructure (Github Actions, Google Sheets/Airtable), and as such is forkable and usable by anyone with a similar project. This process of forking is something we are actively working to streamline; if you have any issues adapting this code to your use case, please let us know via Github Issues and we can help out. This copy of the code is for Airtable, which is a much easier setup than google sheets

## 1. Setting up Github repository

First, clone this repository locally:

`$ git clone `

Next, you will want to make this repository link to a repository *you personally* control, e.g. unlink it from this one. The quickest way to do this is to navigate to this directory, and run:

`$ rm -rf .git`

to remove the original git metadata. Next, go through the steps of re-initialising this as a git repository, and then link it to one you have made on Github (can be public or private).

## 2. Setting up Airtable

### 2.1 Make an Airtable Table

Almost every field that we used for our schema is optional, however there are a few with fixed names that will work best if you use them. The necessary ones are:

- Title (for the title of your entry -- you can also change this in the code but it's a bit fiddly)
- Shortname -- here's where the names of the files corresponding to each entry will go. It's worth filling this out now with recognisable nicknames, but it is also possible to auto-generate (they just might not be very nice). make sure they're unique (this is surprisingly hard to enforce via airtable though the code will handle it if they aren't).
- Last edit -- this will record edits to the sheet, change the data type to the 'Last Modified Time' type

Optionally, you might want to include the following columns:
- Location (this will get rendered as a clickable link)
- Tags (this is rendered as a list of tags)
- Authors (rendered as a list of authors)

If you'd like to have an array field that's not listed here, it's possible to add that later.

### 2.2 Get Airtable API Key, Base Id, and Table Id

These can be found most easily by going to the [API](https://airtable.com/api) tools section of the airtable site, and selecting the relevant base. Tick 'Show API Key', then scroll down till you find both the table id and the base id. They should all be 16-character alphanumeric strings.

Set up a .env file in the top level of this directory to contain these variables. The .gitignore file should already ignore it (check this before committing though) -- this is just there for testing the scripts locally and keeping track of all your variables. In a minute, we'll also add these to the Github action. The table name doesn't *have* to match the actual name of your table (as the id is used to uniquely id the table), but it's used to name the .csv files that get outputted. It should have the following format (make sure there are no spaces, and wrap all the keys/ids in quotation marks):

```
INPUT_CREDS= #airtable API key
BASE_ID= #id of airtable base
TABLE_ID= #id of airtable table
TABLE_NAME= #whatever you want your CSV file to be called
ARCHIVE_DIR="index_archive" #this is the default home for csv files, change if you like
FILES_DIR="entries" #this is the default home for markdown files, change if you like
```

### 2.3 Test out authentication

At this point, with the information from your .env file, the scripts should all be able to run. Run `$ source .env` to add the variables to the environment (I've actually had trouble getting this to work on a new mac -- instead I individually ran `$ export INPUT_CREDS='somekey123'` for each line in the file instead, and that worked fine). Next, from the top level directory, run:

```
$ python3 -m pip install -r requirements.txt
$ python3 scripts/pull_data.py
```

All being well, you should see a folder called `index_archive/` appear, containing a .csv file with a copy of your table, and a folder called `entries/` with a markdown file for each entry. You can delete these for now if you like, so you can test them again with the github action later.

## 3. Setting up authentication

### 3.1 Addding Airtable API key to Github

Your airtable API key needs to go in your github repository's 'Secrets' section (so nobody else can use it). Information on how to do this is [here](https://docs.github.com/en/actions/security-guides/encrypted-secrets). It should be a repository-level secret, called AIRTABLE_API_KEY. You *don't* need to wrap anything here in quotation marks.

### 3.2 Setting up a deploy key

This is probably the most fiddly part of the whole process, but it's also essential for getting the Github action to be able to commit to the repository. The principle of what's going on here is to set up a public-private key pair, that your Github repository knows is authorised to commit to the repo. The private half of the key is kept as a repository secret.

I tend to generate a new .ssh key for this instead of using my existing one (that way even if something goes wrong, it's only the key I use for this repository that can get compromised). To keep track of which is which, I create an untracked folder in this repository called 'keys/' (see .gitignore) and do steps 1 and 2 [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) to generate a new key (using the keys directory instead of the default filepath).

I copy the entire public part of the key into a new ['deploy key'](https://docs.github.com/en/developers/overview/managing-deploy-keys#deploy-keys) attached to the repository, called COMMIT_KEY, and select 'Allow Write Access'. I then repeat the [secret adding](https://docs.github.com/en/actions/security-guides/encrypted-secrets) process from before, but with the private key, creating a new secret that's *also* called COMMIT_KEY. Make sure to copy the entire text of the key, including the bits that say `begin/end OPENSSL private key`.


## 4. Setting up actions


## 5. Setting up a site

site-logo.png
