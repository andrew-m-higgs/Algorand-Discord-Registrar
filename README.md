# Algorand-Discord-Registrar

[<img src="https://open.autocode.com/static/images/open.svg?" width="192">](https://open.autocode.com/)

## Overview

Algorand-Discord-Registrar is a Discord bot to control member registeration and verification for an Algorand NFT project.

Configured by the creator or admin and used by the members.

## Commands

Commands used by the Creator / Admin:

|Command|Description|
|----|----|
|**/config-creator-wallets**|Used to set the wallet addresses of the Creator Wallet|
|**/config-opt-in-token**|Used to set the opt-in token which will be used to confirm wallet ownership|
|**/config-project-name**|Used to set the project name used by the bot for messages.|
|**/config-registered-role**|Used to set the role for all members who have a registered wallet. e.g. @Registered|
|**/config-owner1-role**|Used to set the role for 1 or more NFTs. e.g. @Owner|
|**/config-owner2-role**<br />**/config-owner3-role**<br />**/config-owner4-role**<br />**/config-owner5-role**|Used to set the role for x or more NFTs (options require: Role and x (the # of NFTs)|
|**/config-log-channel**|Used to set the channel to which the bot will log information|

Commands used by members:
|Command|Description|
|----|----|
|**/register**|Used to register their wallet. Gains the role set in **/config-registered-role**|
|**/update-roles**|Used to to check and update roles by member.Checks the number of owned NFTs and gives the highest role achieved while removing all others|
|**/flex**|Used to flex their favourite owned NFT from the creator wallets|
