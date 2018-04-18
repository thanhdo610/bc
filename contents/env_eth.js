var env_eth = `
# Setup Ethereum Quorum environment
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

#### 3. Install Go
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

#### 4. Node Version Manager
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

#### 5. Install Ethereum Quorum

install build deps

    sudo add-apt-repository ppa:ethereum/ethereum
    sudo apt-get update
    sudo apt-get install -y build-essential unzip libdb-dev libleveldb-dev libsodium-dev zlib1g-dev libtinfo-dev solc sysvbanner wrk

install Constellation ([Read more about Constellation](https://github.com/jpmorganchase/constellation))
    
    wget -q https://github.com/jpmorganchase/constellation/releases/download/v0.3.2/constellation-0.3.2-ubuntu1604.tar.xz
    tar xfJ constellation-0.3.2-ubuntu1604.tar.xz
    sudo cp constellation-0.3.2-ubuntu1604/constellation-node /usr/local/bin 
    sudo chmod 0755 /usr/local/bin/constellation-node
    
make/install quorum

    cd
    git clone https://github.com/jpmorganchase/quorum.git
    pushd quorum >/dev/null
    git checkout tags/v2.0.1

    make all

    sudo cp build/bin/geth /usr/local/bin
    sudo chmod 0755 /usr/local/bin/geth

    sudo cp build/bin/bootnode /usr/local/bin
    sudo chmod 0755 /usr/local/bin/bootnode

    popd >/dev/null

install Porosity

**Note**: Porosity is a decompiler for EVM bytecode into readable Solidity-syntax contracts so you can analysis of compiled contracts but also vulnerability discovery

([Read more about Porosity](https://github.com/comaeio/porosity))

    cd
    wget -q https://github.com/jpmorganchase/quorum/releases/download/v1.2.0/porosity
    sudo mv porosity /usr/local/bin
    sudo chmod 0755 /usr/local/bin/porosity
    
`;