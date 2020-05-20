**XML Schema 中 Order 指示器 choice all sequence和 Occurrence 指示器 minOccurs maxOccurs 的用法解释**

# Order 指示器

## all
* &lt;all&gt; 指示器规定子元素可以按照任意顺序出现

### myXsd.xsd文件
```xsd
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="www.shuhaiwen.com" targetNamespace="www.shuhaiwen.com" elementFormDefault="qualified">
	<xsd:complexType name="Student">
		<xsd:all minOccurs="1" maxOccurs="1">
			<xsd:element name="Name" type="xsd:string" minOccurs="0" maxOccurs="1"/>
			<xsd:element name="ID" type="xsd:string" minOccurs="1" maxOccurs="1"/>
			<xsd:element name="Hobby" type="xsd:string" minOccurs="0" maxOccurs="1"/>
		</xsd:all>
	</xsd:complexType>
	<xsd:element name="student" type="Student"/>
</xsd:schema>
```
### myXml.xml文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<Name>shu haiwen</Name>	
	<Hobby> football</Hobby>
	<ID>1342566</ID>
</student>
```
### 分析
* &lt;all&gt;元素和子元素中必须设 maxOccrus="1" ，minOccrus="0" 或 "1"
* &lt;Hobby&gt;元素可以在&lt;ID&gt;元素之前，元素出现顺序无关

### 错误示例xml**依据上面的xsd代码**
*误用1：子元素出现多次*
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<Name>shu haiwen</Name>	
	<Hobby>football</Hobby>
	<Hobby>ready</Hobby>
	<ID>1342566</ID>
</student>
```
**error：&lt;Hobby&gt;出现2次**

## choice
* &lt;choice&gt; 指示器规定元素只能出现一次

### myXsd.xsd文件
```xsd
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="www.shuhaiwen.com" targetNamespace="www.shuhaiwen.com" elementFormDefault="qualified">
	<xsd:complexType name="Student">
		<xsd:choice minOccurs="1" maxOccurs="1">
			<xsd:element name="Name" type="xsd:string" minOccurs="0" maxOccurs="1"/>
			<xsd:element name="ID" type="xsd:string" minOccurs="1" maxOccurs="1"/>
			<xsd:element name="Hobby" type="xsd:string" minOccurs="0" maxOccurs="unbounded"/>
		</xsd:choice>
	</xsd:complexType>
	<xsd:element name="student" type="Student"/>
</xsd:schema>
```
### myXml.xml文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<Hobby> football</Hobby>
	<Hobby>ready</Hobby>
</student>
```
### 分析
* sequence内元素有且只执行一次，由 minOccurs="1" maxOccurs="1"决定，当minOccurs="0"时，可以不执行，当maxOccurs="2" or 3 or unbounded 时，可以执行指定次数
* 只能出现 Name ID Hobby  中一中元素类型，可出现次数取决于 元素中minOccurs maxOccurs 属性
* &lt;student&gt;可以不包含元素，因为 Name 元素的minOccurs="0" ，即当我选择Name元素作为&lt;Student&gt;的子元素时，&lt;Name&gt;可以执行0次,即不执行
* 当选择 ID 元素作为Student 子元素时，必须执行一次
* 当选择 Hobby 元素作为Student 子元素时，可执行任意次，对应xml文件中 &lt;Hobby&gt; football&lt;/Hobby&gt;&lt;Hobby&gt;ready&lt;/Hobby&gt;

### 错误示例xml**依据上面的xsd代码**
*误用1：选择多个子元素*
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<Name>shu haiwen</Name>	
	<ID>1342566</ID>
	<Hobby> football</Hobby>
	<Hobby>ready</Hobby>
</student>
```
**error：&lt;Name&gt; &lt;ID&gt; &lt;Hobby&gt; 只能出现其中一类**

*误用2：同一元素使用超过 maxOccurs 所规定的数量*
```
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<ID>1342566</ID>
	<ID>5464565</ID>
</student>
```
**error：&lt;ID&gt;只能出现一次**

## sequence
* &lt;sequence&gt; 指示器规定元素按顺序出现
* 元素是否出现或出现多少次由 minOccurs 和 maxOccurs 属性限制
* Example

### myXsd.xsd文件
```xsd
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="www.shuhaiwen.com" targetNamespace="www.shuhaiwen.com" elementFormDefault="qualified">
	<xsd:complexType name="Student">
		<xsd:sequence minOccurs="1" maxOccurs="1">
			<xsd:element name="Name" type="xsd:string" minOccurs="0" maxOccurs="1"/>
			<xsd:element name="ID" type="xsd:string" minOccurs="1" maxOccurs="1"/>
			<xsd:element name="Hobby" type="xsd:string" minOccurs="0" maxOccurs="unbounded"/>
		</xsd:sequence>
	</xsd:complexType>
	<xsd:element name="student" type="Student"/>
</xsd:schema>
```

### myXml.xml文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<Name>shu haiwen</Name>	
	<ID>1342566</ID>
	<Hobby> football</Hobby>
	<Hobby>ready</Hobby>
</student>
```

### 分析
* sequence内元素有且只执行一次，由 minOccurs="1" maxOccurs="1"决定，当minOccurs="0"时，可以不执行，当maxOccurs="2" or 3 or unbounded 时，可以执行指定次数
* Name 可以执行一次或不执行，对应xml文件中 &lt;Name&gt;shu haiwen&lt;/Name&gt; 可以不写或只能出现一次
* ID 必须执行一次，必须在 Hobby 之前执行，对应xml文件中 &lt;ID&gt;1342566&lt;/ID&gt;
* Hobby 可执行任意次，对应xml文件中 &lt;Hobby&gt; football&lt;/Hobby&gt;&lt;Hobby&gt;ready&lt;/Hobby&gt;

### 错误示例xml**依据上面的xsd代码**
*误用1： ID元素不能少*
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<Name>shu haiwen</Name>
	<Hobby> football</Hobby>
	<Hobby>ready</Hobby>
</student>
```
**error:缺少&lt;ID&gt;元素**

*误用2：元素顺序错误 *
```xml
<?xml version="1.0" encoding="UTF-8"?>
<student xmlns="www.shuhaiwen.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="www.shuhaiwen.com myXsd.xsd">
	<ID>1342566</ID>
	<Name>shu haiwen</Name>	
	<Hobby> football</Hobby>
	<Hobby>ready</Hobby>
</student>
```
**error:&lt;ID&gt;元素不能在&lt;Name&gt;元素之前或&lt;Hobby&gt;元素之后**

### 注意：以上都是在 &lt;sequence&gt;中 maxOccurs="1" 的情况下满足，当 maxOccurs="2" or unbounded时，不适用

# Occurrence 指示器

## minOccurs
* 限定元素出现的最少次数，可为任意数值

## maxOccurs
* 限定元素出现的最大次数，可为任意数值或unbounded

## 注意：minOccurs只能小于maxOccurs

------

* [我的GitHub](https://github.com/shuhaiwen "我的GitHub地址 https://github.com/shuhaiwen")
* [我的CSDN博客](https://blog.csdn.net/u014140383 "我的CSDN博客地址 https://blog.csdn.net/u014140383")
* [我的码云Gitee](https://gitee.com/shuhaiwen "我的码云Gitee地址 https://gitee.com/shuhaiwen")

------