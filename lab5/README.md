gabrij2 - lab5

# Book Summary
The book provides an in-depth exploration of cloud computing systems and their security mechanisms. I noticed that it primarily targets organizations and larger cloud infrastructures, contrasting with our focus on virtual machines (VMs). It outlines strategies to tackle challenges faced by cloud services and discusses various risks and common attacks, such as data breaches, unauthorized access, and compliance issues. Additionally, the book delves into the setup of cloud computing environments and different architectural configurations.

For our purposes, the most relevant sections were VM security and Identity and Access Management (IAM). However, many of the security measures discussed require higher permissions than those available on our VMs, which are managed by RPI. For instance, implementing Multi-Factor Authentication (MFA), as covered in Domain 2, Section 2.3, was not possibe due to restricted permissions.


# Things I Implemented
Initially, I updated the Ubuntu operating system along with all the essential technologies running on my VM, including Apache, MySQL, PHP, and phpMyAdmin. To enhance security and maintain system integrity, I implemented an automated update mechanism using the command sudo apt-get install unattended-upgrades. This ensures that Ubuntu security patches are applied automatically, reducing the need for manual interventions. Furthermore, I enhanced security by changing both my Azure and VM passwords to stronger, more secure alternatives (when recreating my VM).

Additionally, I considered setting up automatic backups for my data but concluded that it was unnecessary since all my code is securely stored on GitHub. In the event of a system wipe, restoring from the repository would be straightforward. Other security measures, such as IAM and the use of secured images, were already effectively managed. I would have attempted more improvments, but the situtation with ssh and my VM wasted a lot of time and made me slightly scared to attempt any more changes.


# Challenges:
One significant challenge I encountered during this lab was accidentally locking both myself and Dr. Callahan out of the VM. We were unable to SSH into the server as connections would time out. The exact cause of this issue remains unclear, but it may have resulted from attempts to enhance SSH security by adding key verification or activating the UFW firewall. Ultimately, I had to delete and recreate the VM to regain access. This experience highlighted the limitations we face as students, particularly the lack of administrator privileges on the Azure platform, which restricts our ability to implement many of the cloud security measures discussed in the book. 

For instance, I wanted to utilize Azure Monitor to view Apache logs on the Azure dashboard module, but access to the Azure CLI was restricted, likely requiring administrative rights for the entire ITWS student lab cluster. Additionally, I aimed to set up Azure Secrets to periodically rotate authentication keys, such as SSH and GitHub credentials, but was unable to configure this without the necessary permissions. Implementing Azure’s Web App Firewall for an added layer of protection against bot attacks and other common vulnerabilities was also beyond my access rights. Furthermore, as mentioned earlier, setting up MFA was not possible due to permission restrictions. These challenges underscored the critical role of administrative access in fully leveraging cloud security tools and implementing comprehensive security measures.


# Sources
- Book - "Security Guidance for Critical Areas of Focus in Cloud Computing v5"
- Ubuntu unattended updates: https://www.kolide.com/features/checks/ubuntu-unattended-upgrades