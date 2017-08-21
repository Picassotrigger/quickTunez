# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: songGameDB
# Generation Time: 2017-08-20 13:16:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table songs
# ------------------------------------------------------------

CREATE DATABASE songGameDB;
USE songGameDB;
DROP TABLE IF EXISTS `songs`;

CREATE TABLE `songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `songName` varchar(255) DEFAULT NULL,
  `artistName` varchar(255) DEFAULT NULL,
  `genre` text,
  `clipLink` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `screenName` text,
  `scoreRunning` int(11) DEFAULT NULL,
  `scoreThisGame` int(11) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `screenName`, `scoreRunning`, `scoreThisGame`, `lastLogin`, `status`, `createdAt`, `updatedAt`)
VALUES
	(1,'David','DuChene','david@duchene.com','$2a$08$k14GCkTid0gZxGbrmyiWveOuTNeZfdr2sHvAJAzLnW0TLlM69JbQ2','DD',NULL,NULL,NULL,'active','2017-08-19 23:21:47','2017-08-19 23:21:47'),
	(2,'Alice','Wong','alice@wong.com','$2a$08$HFbpR1O4bNLHjNE9nE9hFeQI0T22qbvJKbqynlGRZ0umtwY12Dd6a','AW',NULL,NULL,NULL,'active','2017-08-20 13:05:45','2017-08-20 13:05:45'),
	(3,'Michelle','Kidd','michelle@kidd.com','$2a$08$nm7.1kK1yixjAHcbyHPjsenKj1.1SKbq5mf6AcTgONRkGXoJjMxEu','MK',NULL,NULL,NULL,'active','2017-08-20 13:12:12','2017-08-20 13:12:12'),
	(4,'Anagha','Babu','anagha@babu.com','$2a$08$WXcKPz5HU/xjhryVgMMXSOayh0RZMw0kwoGoJ19NtzyrxvKhRstN2','AB',NULL,NULL,NULL,'active','2017-08-20 13:13:09','2017-08-20 13:13:09'),
	(5,'Arnob','Bhuyan','arnob@bhuyan.com','$2a$08$bnmdWyNgnaNqFYaqEXIjK.9eXOfVnMmjQ8BlmR9gUxcD0VZA4ZdhK','AB2',NULL,NULL,NULL,'active','2017-08-20 13:14:06','2017-08-20 13:14:06');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
