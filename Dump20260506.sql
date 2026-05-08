-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: app_finanzas
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id_account` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_currency` int DEFAULT NULL,
  `id_type` int DEFAULT NULL,
  `balance` decimal(30,2) NOT NULL DEFAULT '0.00',
  `account_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deactivated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_account`),
  KEY `id_user` (`id_user`),
  KEY `id_currency` (`id_currency`),
  KEY `id_type` (`id_type`),
  CONSTRAINT `account_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `account_ibfk_2` FOREIGN KEY (`id_currency`) REFERENCES `currencytype` (`id_currency`),
  CONSTRAINT `account_ibfk_3` FOREIGN KEY (`id_type`) REFERENCES `accounttype` (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,1,2,1,9999999999999999999999999999.99,'Sistema','2026-05-06 04:57:05',NULL),(2,2,1,2,313500.00,'Salario','2026-05-06 05:07:24',NULL),(3,2,1,3,78500.00,'Salidas','2026-05-06 05:40:08',NULL),(4,2,1,3,26000.00,'Regalos','2026-05-06 06:04:04',NULL),(5,2,1,1,69000.00,'Casa','2026-05-06 06:42:07',NULL),(6,2,2,3,20.00,'Comida','2026-05-06 16:24:28',NULL),(7,2,2,2,480.00,'Dolares','2026-05-06 16:24:58',NULL),(8,2,1,3,0.00,'Hola','2026-05-06 16:35:56',NULL),(9,2,4,3,0.00,'JAJA','2026-05-06 16:38:30',NULL),(10,2,4,2,38000.00,'Prueba','2026-05-06 16:41:58',NULL);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounttype`
--

DROP TABLE IF EXISTS `accounttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounttype` (
  `id_type` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounttype`
--

LOCK TABLES `accounttype` WRITE;
/*!40000 ALTER TABLE `accounttype` DISABLE KEYS */;
INSERT INTO `accounttype` VALUES (1,'Activo'),(2,'Ingreso'),(3,'Gasto'),(4,'Ahorro'),(5,'Pasivo');
/*!40000 ALTER TABLE `accounttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `automovement`
--

DROP TABLE IF EXISTS `automovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `automovement` (
  `id_auto` int NOT NULL AUTO_INCREMENT,
  `id_dest_account` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_period` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deactivated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_auto`),
  KEY `fk_auto_dest` (`id_dest_account`),
  CONSTRAINT `automovement_ibfk_1` FOREIGN KEY (`id_dest_account`) REFERENCES `account` (`id_account`),
  CONSTRAINT `fk_auto_dest` FOREIGN KEY (`id_dest_account`) REFERENCES `account` (`id_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automovement`
--

LOCK TABLES `automovement` WRITE;
/*!40000 ALTER TABLE `automovement` DISABLE KEYS */;
/*!40000 ALTER TABLE `automovement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget` (
  `id_budget` int NOT NULL AUTO_INCREMENT,
  `id_account` int DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_budget`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `budget_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget`
--

LOCK TABLES `budget` WRITE;
/*!40000 ALTER TABLE `budget` DISABLE KEYS */;
INSERT INTO `budget` VALUES (1,3,45000.00,'2026-05-06 05:44:13','2026-05-07 05:44:13'),(2,4,100000.00,'2026-05-06 06:04:42','2026-06-05 06:04:42'),(3,6,30.00,'2026-05-06 16:30:18','2026-05-13 16:30:18'),(4,9,10000.00,'2026-05-06 16:42:58','2026-05-13 16:42:58');
/*!40000 ALTER TABLE `budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencytype`
--

DROP TABLE IF EXISTS `currencytype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencytype` (
  `id_currency` int NOT NULL AUTO_INCREMENT,
  `iso` varchar(3) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_currency`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencytype`
--

LOCK TABLES `currencytype` WRITE;
/*!40000 ALTER TABLE `currencytype` DISABLE KEYS */;
INSERT INTO `currencytype` VALUES (1,'CRC','Colón costarricense'),(2,'USD','US Dollar'),(3,'EUR','Euro'),(4,'JPY','Japanese Yen');
/*!40000 ALTER TABLE `currencytype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exchangerate`
--

DROP TABLE IF EXISTS `exchangerate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchangerate` (
  `id_exchange_rate` int NOT NULL AUTO_INCREMENT,
  `from_currency` int DEFAULT NULL,
  `to_currency` int DEFAULT NULL,
  `rate` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_exchange_rate`),
  KEY `from_currency` (`from_currency`),
  KEY `to_currency` (`to_currency`),
  CONSTRAINT `exchangerate_ibfk_1` FOREIGN KEY (`from_currency`) REFERENCES `currencytype` (`id_currency`),
  CONSTRAINT `exchangerate_ibfk_2` FOREIGN KEY (`to_currency`) REFERENCES `currencytype` (`id_currency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exchangerate`
--

LOCK TABLES `exchangerate` WRITE;
/*!40000 ALTER TABLE `exchangerate` DISABLE KEYS */;
/*!40000 ALTER TABLE `exchangerate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id_transaction` int NOT NULL AUTO_INCREMENT,
  `id_orig_account` int DEFAULT NULL,
  `id_dest_account` int DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(255) NOT NULL DEFAULT 'Transacción de dinero',
  PRIMARY KEY (`id_transaction`),
  KEY `id_orig_account` (`id_orig_account`),
  KEY `id_dest_account` (`id_dest_account`),
  CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`id_orig_account`) REFERENCES `account` (`id_account`),
  CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`id_dest_account`) REFERENCES `account` (`id_account`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,1,2,10000.00,'2026-05-06 05:32:41','Transaccion hecha'),(2,1,2,10000.00,'2026-05-06 05:39:25','Transacción de dinero'),(3,2,3,5000.00,'2026-05-06 05:40:20','Transacción de dinero'),(4,2,3,2500.00,'2026-05-06 05:42:45','Transacción de dinero'),(5,1,2,10000.00,'2026-05-06 05:43:18','Transacción de dinero'),(6,2,3,1500.00,'2026-05-06 05:43:33','Transacción de dinero'),(7,2,3,20000.00,'2026-05-06 05:43:58','Transacción de dinero'),(8,1,2,5000.00,'2026-05-06 05:55:37','Transacción de dinero'),(9,2,3,2000.00,'2026-05-06 05:55:47','Transacción de dinero'),(10,1,2,250000.00,'2026-05-06 06:04:57','Transacción de dinero'),(11,1,2,20000.00,'2026-05-06 06:31:46','Transacción de dinero'),(12,1,2,1000.00,'2026-05-06 06:32:37','Transacción de dinero'),(13,1,2,35000.00,'2026-05-06 07:51:51','Transacción de dinero'),(14,2,3,25000.00,'2026-05-06 07:52:43','Transacción de dinero'),(15,1,2,15000.00,'2026-05-06 08:50:31','Transacción de dinero'),(16,2,3,20000.00,'2026-05-06 09:31:23','Transacción de dinero'),(17,2,5,75000.00,'2026-05-06 09:31:57','Transacción de dinero'),(18,5,4,25000.00,'2026-05-06 09:32:11','Transacción de dinero'),(19,1,5,20000.00,'2026-05-06 09:32:37','Transacción de dinero'),(20,5,4,1000.00,'2026-05-06 16:09:15','Transacción de dinero'),(21,1,2,1000.00,'2026-05-06 16:23:18','Transacción de dinero'),(22,2,3,2500.00,'2026-05-06 16:23:25','Transacción de dinero'),(23,1,7,500.00,'2026-05-06 16:25:07','Transacción de dinero'),(24,7,6,20.00,'2026-05-06 16:25:19','Transacción de dinero'),(25,1,10,40000.00,'2026-05-06 16:42:24','Transacción de dinero'),(26,10,9,2000.00,'2026-05-06 16:42:43','Transacción de dinero'),(27,1,2,100000.00,'2026-05-06 16:54:52','Transacción de dinero'),(28,1,2,10000.00,'2026-05-06 16:55:39','Transacción de dinero');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `last_name1` varchar(50) NOT NULL,
  `last_name2` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password_hash1` varchar(255) NOT NULL,
  `password_hash2` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'SYSTEM','SYSTEM','SYSTEM','system@app.com','system','system','2026-05-06 04:42:47'),(2,'Santiago','Ballestero','Sánchez','prueba@gmail.com','$2b$10$WiAZaJlyg0./R2zr48a6cOxfqaOLS2.rXwRbUVsSBb4gCJj0W5TJC','$2b$10$jjDBJFqMjgwTf9.3D9C/u.5QO5IH0TlYxiAFR5YMdHCA7j8uwhtFq','2026-05-06 05:06:53');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-06 10:57:10
