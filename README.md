# 1) Installer la version composer requise:
	- curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --version=1.10.1



# 2) Installer tous les dependances de php:
	- sudo apt install php php-cli php-fpm php-json php-common php-mysql php-zip php-gd php-mbstring php-curl php-xml php-pear php-bcmath



# 3) Ajouter le virtualhost du back (symfony)

	<VirtualHost *:80>
        ServerName back-test.inventaire.asma-technologies.fr
        DocumentRoot "/var/www/projet_01/test/html/Back/public"
        SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
        ProxyPass /hub/ http://localhost:3000/
        ProxyPassReverse /hub/ http://localhost:3000/
        ErrorLog "/var/www/projet_01/test/html/Back/projet_01_test-error.log"
        CustomLog "/var/www/projet_01/test/html/Back/projet_01_test-access.log" common

        <Directory "/var/www/projet_01/test/html/Back/public">
            AllowOverride All
            Require all granted
            #Order Allow,Deny
            #Allow from All
            <IfModule mod_rewrite.c>
                Options -MultiViews
                RewriteEngine On

                RewriteCond %{REQUEST_FILENAME} !-f
                RewriteRule ^(.*)$ index.php [QSA,L]
            </IfModule>
        </Directory>
        SetEnv CORS_ALLOW_ORIGIN "*"
	</VirtualHost>



# 4) Ajouter le virtualhost front (angular)
	
<VirtualHost *:80>
	ServerName front-test.inventaire.asma-technologies.fr
	DocumentRoot "/var/www/projet_01/test/html/Front/dist/light"
	ErrorLog "/var/www/projet_01/test/html/Front/dist/light/projet_01_test-error.log"
	CustomLog "/var/www/projet_01/test/html/Front/dist/light/projet_01_test-access.log" common
	<Directory /var/www/projet_01/test/html/Front/dist/light>
	    RewriteEngine On
	    # If an existing asset or directory is requested go to it as it is
	    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
	    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
	    RewriteRule ^ - [L]

	    # If the requested resource doesn't exist, use index.html
	    RewriteRule ^ /index.html
	</Directory>
</VirtualHost>


	
# 5) Activer le mode rewrite:
	- sudo a2enmod rewrite && sudo service apache2 restart
	


# 6) Activer le port 8081 pour le symfony
	- 



# 7) Générer le jwt
	openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
	openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
	sudo chmod 644 public.pem private.pem



# 8) Liste des fichiers à modifier:
	 - Back/.env
	 - Back/src/Service/MercureCookieGenerator.php
	 - Back/src/Entity/UserNotif.php
	 - Front/src/environments/environment.prod.ts
	 - Front/src/app/layout/header/header.component.ts
	 - Front/src/app/shared/service/shared.service.ts



# 9) Ajouter le script pour executer mercure comme service
	- sudo nano /etc/systemd/system/mercure.service     
                                                                              
	[Unit]
	Description=Mercure protocol
	After=syslog.target
	After=network.target[Service]
	User=root
	Type=simple

	[Service]
	ExecStart=/var/www/projet_01/test/html/mercure/mercure --jwt-key='asma' --addr=':3000' --allow-anonymous --cors-allowed-origins='*' --publish-allowed-origins='*'
	Restart=always
	StandardOutput=syslog
	StandardError=syslog
	SyslogIdentifier=helloworld

	[Install]
	WantedBy=multi-user.target



# 10) Augmenter la memory limit de php
	sudo nano +409 /etc/php/7.4/apache2/php.ini

	memory_limit = 536870912M

	sudo systemctl restart apache2






