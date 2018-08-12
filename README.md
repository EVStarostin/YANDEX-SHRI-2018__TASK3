# Задание 3 — реализовать алгоритм

## РЕШЕНИЕ

### Структура
Функция реализована в файле **./src/makeSchedule.js** с именем **makeSchedule**.   
Функцию можно импортировать в других файлах `var makeSchedule = require('./makeSchedule')`.   
Функция принимает объект со списком устройств, тарифами и максимальной мощностью.  
Для тестов на вход подается json файл из папки **./jsons**.  
На выходе функция возвращает объект с расписанием работы устройств, стоимостью общей потребленной энергии и с разбивкой по устройствам.   
Для тестирования использовал библиотеку ***mocha + chai***.  
Тесты написаны в файле **./src/makeSchedule.spec.js**.  
В функции и в тестах использовался синтаксис *es6* без транспиляции.

### Запуск
1. `npm run start` - выполняется функция (на входе *./jsons/input.json*), результат работы выводится в консоль.   
2. `npm run test` - запускаются тесты.   
3. `npm run eslint` - js файлы в папке *./src* проверяются и по возможности исправляются линтером со стандартным конфигом.   

### Алгоритм реализован следующим образом:
1. Устройства сортируются в следующем порядке: 
  - сначала идут устройства, для которых критично, в какое время они должны отработать + они сортирутся по потребляемой мощности по убыванию.  
  - потом идут устройства, которые могут работать как днем, так и ночью. Эти устройства также сортируются по потребляемой мощности по убыванию.
Это сделано для того, чтобы устройствам, которым необходимо работать только днем или только ночью, хватило места в сетке. Они заполняют расписание в первую очередь.

2. Тарифы сортируются по возрастанию стоимости электроэнергии в час, т.е. сначала должны идти самые дешевые.

3. Пытаемся записать первое устройство (с заданым временем суток и максимальной потребляемой мощностью) в первый час самого дешевого тарифа.
Проверяем, что время суток подходящее и что максимальная мощность вместе с этим устройством не превышает максимальную. Если время дня не совпадает или максимальная мощность превышает, тогда переходим к следующему часу.

4. Если устройство удалось поместить в выбранный час, тогда уменьшаем длительность цикла работы на единицу.
На следущем шаге проверяем, что длительность цикла работы не равна нулю и повторяем 3 шаг заново.
Если длительность цикла работы равна 0, то переходим к следущему устройству.

### Тесты
Реализованы тесты на проверку входных данных:  
- **inputData.devices** присутствует и является массивом;  
- **inputData.rates** присутствует и является массивом;  
- **inputData.maxPower** присутствует и является числом;  
При некорректных входных данных выбрасывается ошибка `throw new Error()`  

Реализованы тесты с входными данными из примера:
- суммарная стоимость потраченной электроэнергии **consumedEnergy** не больше **38.939**;
- потребляемая мощность **maxPower** за каждый час не превышает **2100**;
- если для устройства задано свойство **mode**, то оно должно отработать именно в то время суток, которое указано в **mode**;  
- все устройства отработали **полный цикл**, который задан в свойсте **duration**;  

