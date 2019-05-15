ng serve --host 0.0.0.0 --disableHostCheck

http-server -P http://localhost:4200/ -S -p 8081

http-server -S --cors -P http://localhost:8080 -p 8082

docker run -p 4443:4443 --rm -e openvidu.secret=MY_SECRET -e openvidu.publicurl=https://192.168.0.22:4443/ openvidu/openvidu-server-kms:2.9.0

docker run -p 4443:4443 --rm -e openvidu.secret=MY_SECRET -e openvidu.publicurl=https://werewolf.localdomain.com/openvidu/ openvidu/openvidu-server-kms:2.9.0


[TODO]

- [P2] Arrêter une partie
- [P2] Mettre en pause une partie
  - proposer de quitter la partie (retour liste des parties)
  - proposer de recommencer une partie avec les mêmes options
  - proposer de changer les options
- [P2] Retourner à la liste des parties à tout moment
- [P3] Choisir les options (musique d'ambiance, temps, ...)
- [P3] Positionner correctement les images (dead, looser, winner) en fonction de la taille de la caméra (calculer ratio pour chaque video ou utiliser du js pour positionner ?). Dépend de la taille de chaque device