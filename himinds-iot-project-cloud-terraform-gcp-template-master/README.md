# Internet of Things service as a code

The aim of this project is to store a configurable Internet of Things service which will run on the Google Cloud Platform.

The Internet of Things service is stored as a Terraform project. If you install the service and run the project file you will receive a Google cloud project inside your account with the necessary components installed and set up.
To be able to provision a system on your account you need the Google SDK framework installed and connected to your account.

## Set up your worknode

This project contains an Ansible playbook file to set up these services on a debian distribution linux worknode. The file's name is: worknode.yml
To run this you need:
* a linux host (virtualbox, cloud node, etc... ).
* On this host you need Ansible installed.
 
To install Ansible you will find help on the [[official Ansible page][https://docs.ansible.com/installation_guide?intro_installation.html]]. 

To check your installation use:

```
$ ansible --version # 
```
To execute it on your computer you should run:

```
$ ansible-playbook -K worknode.yml
```

Info: run it with a sudoer or root user because it will ask for the sudo password. In case you mistype your password Ansible will keep triing to log on. Based on your configuration it might lock your user.

## Set up a Google SDK server -- Linux guide

To check is the Google Cloud SDK properly installed run:

```
$ gcloud --version
```

For this step you need a Google Cloud Platform account. To connect your command line interface to your account. Use the command line:

```
$  gcloud init
```

From this point just follow the instructions on the screen. For more information you can check out [[Google's SDK Linux Kickstart][https://cloud.google.com/sdk/docs/quickstart-linux]] page.
So far that is all that you have to do because Terraform will interact with the Google SDK. It will configure it up with the default settings. More about this in the next section.

There are many environment variables and a project have to be set up to be able to provision from gcloud with Terraform.
There is an extended documentum released by Google how to make the [[Google Cloud SDK with Terraform][https://cloud.google.com/community/tutorials/managing-gcp-projects-with-terraform]].

There is another Ansible playbook which can be run to set up the a Terraform provisioning project. Before you use it you have to log onto your Google Cloud Platform account but at this steps you should have done it.

Before you run it install the dependency Python modules:

```
pip install -r requirements.txt 
```

The Ansible playbook will:
* create a project for Terraform
* set up a backend storage to store the output of Terraform
* set up the environment variables in the provisioner user's .profile file
* enable the iot service
* there is no organisation and billing details set up: we expect that your account is not a corporate but a personal account

After running the Ansible playbook:

```
ansible-playbook -K worknode_gcloud.yml
```

This steps can be added to the worknode.yml however it is not a requirement for Terraform or Gcloud. It is a requirement for using Ansible to provision with Terraform.

## Set up Terraform

To check is Terraform properly installed on your computer you should run:

```
$ terraform --version
```

Terraform will provision a new project in your Google Cloud Platform account with the default variable names defined in the environment.tfvars file.

To prepare Terraform for the installation (to order it to download the right modules and plugins) run:

```
$ terraform init
```

Before deploying Terraform creates a deployment plan. This is the step where it checks the configuration file's syntax and create a readable output what will be the results after the configuration:

```
$ terraform plan
```

Info: The plan can be long and verbose. You might you want to save it in a file. For this run instead:

```
$ terraform plan -out=tfplan
```

If you are satisfied with the result run:

```
$ terraform apply -var-file=environment.tfvars
```

If everything goes according to the plans you will have:

* A project. The default name is: HiMinds IoT
* The region is set to: europe-west3
* The zone is set to: europe-west3-b
* The topics. The default name is: tour-pub
* The subscription. The default name is: tour-sub
* The device registry. The default name is: tour-registry
* Creates a device which can connect to the registry. For this Terraform will generate the key on the fly. (See [[tls private key resource][https://www.terraform.io/docs/providers/tls/r/private_key.html]]) The default device name is: test-device

## What's next?

It is possible to use Ansible to set up and install services on the Google Cloud platform. In the future this section will be added to this project. For this a Pubsub server component on Terraform an additional component will be added.

Preferable containerise the service and set up an inmutable infrastructure with Terraform and Kubernetes (Kubernetes configured by Terraform only).
