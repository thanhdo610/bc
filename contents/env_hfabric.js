var env_hfabric = `
  
# Setup Hyperledger Fabric environment
* * *
## I. Prerequisites
* [VirtualBox 5.2.6 platform packages](https://www.virtualbox.org/wiki/Downloads)
* [Ubuntu Server 16.04.3 LTS](https://www.ubuntu.com/download/server)
* One sudo non-root user

#### 1. Update and upgrade the Ubuntu
If you are ready, update and upgrade the Ubuntu packages on your machine. This ensures that you have the latest security patches and fixes, as well as updated repos for your new packages.

    sudo apt-get -y update
    sudo apt-get -y upgrade

#### 2. Install build-essential
The build-essentials is a reference for all the packages needed to compile a debian package. It generally includes the gcc/g++ compilers an libraries and some other utils. Check the documentation: [Here!](http://packages.ubuntu.com/xenial/build-essential)

    sudo apt-get install build-essential

#### 3. Install Docker
Docker is an application that makes it simple and easy to run application processes in a container, which are like virtual machines, only more portable, more resource-friendly, and more dependent on the host operating system.

First, add the GPG key for the official Docker repository to the system:

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

Add the Docker repository to APT sources:

    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

Next, update the package database with the Docker packages from the newly added repo:

    sudo apt-get update

Make sure you are about to install from the Docker repo instead of the default Ubuntu 16.04 repo:

    apt-cache policy docker-ce

You should see output similar to the follow:

    docker-ce:
        Installed: (none)
        Candidate: 17.03.1~ce-0~ubuntu-xenial
        Version table:
            17.03.1~ce-0~ubuntu-xenial 500
                500 https://download.docker.com/linux/ubuntu xenial/stable amd64 Packages
            17.03.0~ce-0~ubuntu-xenial 500
                500 https://download.docker.com/linux/ubuntu xenial/stable amd64 Packages

Notice that docker-ce is not installed, but the candidate for installation is from the Docker repository for Ubuntu 16.04. The docker-ce version number might be different.

Finally, install Docker:

    sudo apt-get install -y docker-ce

Executing the Docker Command Without Sudo.

By default, running the docker command requires root privileges — that is, you have to prefix the command with sudo. If you want to avoid typing sudo whenever you run the docker command, add your username to the docker group:

    sudo usermod -aG docker \${USER}

To apply the new group membership, you can **log out of the server and back in**.

Docker should now be installed, the daemon started, and the process enabled to start on boot. Check that it's running:

    sudo systemctl status docker

The output should be similar to the following, showing that the service is active and running:

    ● docker.service - Docker Application Container Engine
        Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
        Active: active (running) since Sun 2016-05-01 06:53:52 CDT; 1 weeks 3 days ago
        Docs: https://docs.docker.com
        Main PID: 749 (docker)

#### 4. Install Docker Compose

Run this command to download the latest version of Docker Compose:
    
    sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-\`uname -s\`-\`uname -m\` -o /usr/local/bin/docker-compose

Apply executable permissions to the binary:

    sudo chmod +x /usr/local/bin/docker-compose

Test the installation.

    docker-compose --version
    docker-compose version 1.19.0, build 1719ceb

#### 5. Install Go
Hyperledger Fabric uses the Go programming language for many of its components.

Begin downloading the latest package for Go by running this command, which will pull down the Go package file, and save it to your current working directory, which you can determine by running **pwd**.

    sudo curl -O https://storage.googleapis.com/golang/go1.9.2.linux-amd64.tar.gz

Next, use tar to unpack the package

    sudo tar -xvf go1.9.2.linux-amd64.tar.gz
    sudo mv go /usr/local

First, set Go’s root value, which tells Go where to look for its files.

    vi ~/.profile

At the end of the file, add this line:

    export PATH=$PATH:/usr/local/go/bin
    
Since we’ll be doing a bunch of coding in Go, setting Go for Hyperledger
    
    vi ~/.bashrc

At the end of the file, add this line:

    export GOPATH=$HOME/go
    export PATH=$PATH:$GOPATH/bin

Next, refresh your bash by running:

    source ~/.profile    
    source ~/.bashrc

Testing your go installation

    go version // and it should print the installed go version 1.9.1
    echo $GOPATH // /Users/xxx/go

#### 6. Node Version Manager
To install or update nvm, you can use the install script using cURL:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

The script clones the nvm repository to ~/.nvm and adds the source line to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).

**Note**: On Linux, after running the install script, if you get nvm: command not found or see no feedback from your terminal after you type:

    command -v nvm

simply close your current terminal, open a new terminal, and try verifying again.

Install node LTS version

    nvm install --lts
    nvm use --lts

Update npm

    npm install npm@latest -g

Check node verion

    node -v // v8.9.4
	
***
## II. Testing Your First Network

Determine a location on your machine where you want to place the Hyperledger Fabric samples applications repository and open that in a terminal window. Just assume /home/\${USER}

	cd
	
Then, execute the following commands:

	git clone https://github.com/hyperledger/fabric-samples.git ~/fabric-samples
    cd ~/fabric-samples
    
Next, we will install the Hyperledger Fabric platform-specific binaries.

    curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/v1.0.5/scripts/bootstrap.sh | bash -s 1.0.5

The curl command above downloads and executes a bash script that will download and extract all of the platform-specific binaries you will need to set up your network and place them into the cloned repo you created above. It retrieves four platform-specific binaries:

    * cryptogen,
    * configtxgen,
    * configtxlator, and
    * peer

and places them in the bin sub-directory of the current working directory.

You may want to add that to your PATH environment variable so that these can be picked up without fully qualifying the path to each binary. e.g.:

    export PATH=<path to download location>/bin:$PATH

Generate Network Artifacts

    cd ~/fabric-samples/first-network
    ./byfn.sh -m generate

Navigate to the fabcar subdirectory within your fabric-samples repository and take a look at what’s inside:

    cd ~/fabric-samples/fabcar  && ls

You should see the following:

    enrollAdmin.js     invoke.js       package.json    query.js        registerUser.js startFabric.sh

Before starting we also need to do a little housekeeping. Run the following command to kill any stale or active containers:

    docker rm -f $(docker ps -aq)

Clear any cached networks:

    # Press 'y' when prompted by the command
    docker network prune

And lastly if you’ve already run through this tutorial, you’ll also want to delete the underlying chaincode image for the fabcar smart contract. If you’re a user going through this content for the first time, then you won’t have this chaincode image on your system:

    docker rmi dev-peer0.org1.example.com-fabcar-1.0-5c906e402ed29f20260ae42283216aa75549c571e2e380f3615826365d8269ba

#### Install the clients & launch the network

Run the following command to install the Fabric dependencies for the applications.

    npm install

Launch your network using the startFabric.sh shell script. 

    ./startFabric.sh

Enroll user

    node enrollAdmin.js
    node registerUser.js

Querying the Ledger

    node query.js

It should return something like this:

    Query result count =  1
    Response is  [{"Key":"CAR0", "Record":{"colour":"blue","make":"Toyota","model":"Prius","owner":"Tomoko"}},
    {"Key":"CAR1",   "Record":{"colour":"red","make":"Ford","model":"Mustang","owner":"Brad"}},
    {"Key":"CAR2", "Record":{"colour":"green","make":"Hyundai","model":"Tucson","owner":"Jin Soo"}},
    {"Key":"CAR3", "Record":{"colour":"yellow","make":"Volkswagen","model":"Passat","owner":"Max"}},
    {"Key":"CAR4", "Record":{"colour":"black","make":"Tesla","model":"S","owner":"Adriana"}},
    {"Key":"CAR5", "Record":{"colour":"purple","make":"Peugeot","model":"205","owner":"Michel"}},
    {"Key":"CAR6", "Record":{"colour":"white","make":"Chery","model":"S22L","owner":"Aarav"}},
    {"Key":"CAR7", "Record":{"colour":"violet","make":"Fiat","model":"Punto","owner":"Pari"}},
    {"Key":"CAR8", "Record":{"colour":"indigo","make":"Tata","model":"Nano","owner":"Valeria"}},
    {"Key":"CAR9", "Record":{"colour":"brown","make":"Holden","model":"Barina","owner":"Shotaro"}}]

Congratulation, you've done seting up your Hyperledger Fabric environments!

Now, you may want completely remove all incriminating evidence of the network on your system:

    cd ~/fabric-samples/basic-network
    ./stop.sh
    docker rm -f $(docker ps -aq)
    docker network prune
    docker rmi dev-peer0.org1.example.com-fabcar-1.0-5c906e402ed29f20260ae42283216aa75549c571e2e380f3615826365d8269ba
    ./teardown.sh
    rm -rf ~/fabric-samples/fabcar/hfc-key-store/*
`;
