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
|**/config-log-channel**|Used to set the channel to which the bot will log information|
|**/config-opt-in-token**|Used to set the opt-in token which will be used to confirm wallet ownership|
|**/config-owner-roles**|Used to set the roles given to reward owners of multiple NFTs|
|**/config-project-name**|Used to set the project name used by the bot for messages.|
|**/config-registered-role**|Used to set the role for all members who have a registered wallet. e.g. @Registered|

Commands used by members:
|Command|Description|
|----|----|
|**/flex**|Used to flex their favourite owned NFT from the creator wallets|
|**/register**|Used to register their wallet. Gains the role set in **/config-registered-role**|
|**/update-roles**|Used to to check and update roles by member.Checks the number of owned NFTs and gives the highest role achieved while removing all others|
|**/view-owner-roles**|Get a list of roles assigned based on the number of NFTs held|
