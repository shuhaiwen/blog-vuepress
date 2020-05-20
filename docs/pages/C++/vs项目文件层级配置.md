# 步骤一：辅助Temp Lib include Bin文件夹及其子文件到解决方案路径下
1. Temp 文件存放临时生成文件
2. Lib文件存放lib文件
3. include文件存放第三方库文件
4. Bin存放Debug/Release版的dll,exe等文件

# 步骤二：项目属性中设置以下属性
## 1. Output Directory（输出目录，链接器）栏位填入：
$(SolutionDir)\Temp\Link\$(ProjectName)\$(ConfigurationName)
## 2. Intermediate Directory（中间目录，编译器）栏位填入：
$(SolutionDir)\Temp\Compile\$(ProjectName)\$(ConfigurationName)
## 3. 在Build Event->Post-Build Event->Command Line中填入，All配置下：
copy $(TargetPath)    $(SolutionDir)\Bin\$(ConfigurationName);
## 4. Debugging->Command中填入：
```
$(SolutionDir)\Bin\$(ConfigurationName)\$(TargetFileName)
或Debug版设置 $(SolutionDir)\Bin\Debug\$(TargetFileName)
或Release版设置 $(SolutionDir)\Bin\Release\$(TargetFileName)
```
## 5. Debugging->Working Directory填入：
```
$(SolutionDir)\Bin\$(ConfigurationName)\
或Debug版设置 $(SolutionDir)\Bin\Debug\
或Release版设置 $(SolutionDir)\Bin\Release\
```