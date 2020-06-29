---
title: XML-final属性
date: 2020-05-21
sidebarDepth: 2
tags:
 - Xml
categories:
 - 前端
---
# xml-final属性
## final
可选。防止从该 complexType 元素派生指定的类型。该值可以包含 #all 或者一个列表，该列表是 extension 或 restriction 的子集。

## 举例如下：
* 设置final属性 extension； 防止通过扩展派生。
```
    <xsd:complexType name="Student">
		<xsd:complexContent>
			<xsd:extension base="Person">
				<xsd:sequence minOccurs="1" maxOccurs="1">
					<xsd:element name="ID" type="xsd:string" minOccurs="1" maxOccurs="1"/>
					<xsd:element name="Hobby" type="xsd:string" minOccurs="0" maxOccurs="1"/>
				</xsd:sequence>
			</xsd:extension>
		</xsd:complexContent>
	</xsd:complexType>
	<xsd:complexType name="Person" final="extension">
		<xsd:sequence>
			<xsd:element name="Sex" type="xsd:string" minOccurs="1" maxOccurs="1"/>
			<xsd:element name="Name" type="xsd:string" minOccurs="1" maxOccurs="5"/>
		</xsd:sequence>
	</xsd:complexType>
```
**分析**：此时检验文件会报错：Type 'Student' is not a valid extension of type 'Person'. 
由报错信息可以知道，由于<xsd:complexType name="Person" final="extension">中final属性是extension，导致Person不能被Student派生。
* 设置final属性 restriction； 防止通过限制派生。
```
	<xsd:simpleType name="Id"  final="restriction">
		<xsd:restriction base="xsd:string">
			<xsd:pattern value="[a-zA-Z0-9\\\-\.\|:_#/]+"/>
		</xsd:restriction>
	</xsd:simpleType>
	<xsd:simpleType name="res">
		<xsd:restriction base="Id"></xsd:restriction>
	</xsd:simpleType>
```
**分析**:此时检验文件会报错：Attribute 'final' does not allow derivation by restriction of type definition 'res' from base type definition 'OtxId'.
由错误信息可以知道，由于<xsd:simpleType name="OtxId"  final="restriction">中final属性为restriction，导致Id不能被限制派生。
* 设置final属性 #all； 防止通过限制和扩展派生。
## 完整代码
xsd.xsd文件
```
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="www.shuhaiwen.com" targetNamespace="www.shuhaiwen.com" elementFormDefault="qualified">
	<xsd:complexType name="Student">
		<xsd:complexContent>
			<xsd:extension base="Person">
				<xsd:sequence minOccurs="1" maxOccurs="1">
					<xsd:element name="ID" type="xsd:string" minOccurs="1" maxOccurs="1"/>
					<xsd:element name="Hobby" type="xsd:string" minOccurs="0" maxOccurs="1"/>
				</xsd:sequence>
			</xsd:extension>
		</xsd:complexContent>
	</xsd:complexType>
	<xsd:complexType name="Person" final="restriction">
		<xsd:sequence>
			<xsd:element name="Sex" type="xsd:string" minOccurs="1" maxOccurs="1"/>
			<xsd:element name="Name" type="xsd:string" minOccurs="1" maxOccurs="5"/>
		</xsd:sequence>
	</xsd:complexType>
	<xsd:element name="entry" type="animal"/>
	<xsd:complexType name="animal">
		<xsd:sequence>
			<xsd:element name="person" type="Person"/>
		</xsd:sequence>
	</xsd:complexType>
</xsd:schema>
```
xml.xml文件
```
<?xml version="1.0" encoding="UTF-8"?>
<entry xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<person xsi:type="Student">
		<Sex>man</Sex>
		<Name>Nic</Name>
		<ID>001</ID>
		<Hobby>singing</Hobby>
	</person>
</entry>

```