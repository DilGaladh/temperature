#!/bin/bash

# L’adresse IP du serveur que vous voulez pinger (8.8.8.8 est un serveur DNS public de Google)

SERVER=8.8.8.8

# Envoyer seulement 2 pings, et envoyer la sortie vers /dev/null

ping -c2 ${SERVER} > /dev/null

# Si le code retour du ping ($?) est différent de 0 (qui correspond à une erreur)

if [ $? != 0 ]

then

# Restart the wireless interface

# Relancer l’interface wifi

ifdown –force wlan0

ifup wlan0

fi