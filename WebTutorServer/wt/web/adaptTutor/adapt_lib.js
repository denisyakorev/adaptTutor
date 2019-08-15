/**
* Функция распаковывает архив курса в папку курсов WebTutor
* @param String zip_path - путь к архиву курса
* @param String code - уникальный код курса
* @return String - путь к каталогу с разархивированным курсом
*/
function unzip_course(course_path, code){
    var new_path = "x-local://wt/web/webtutor/"+ code;
    try{
        ZipExtract(course_path, new_path);
        return UrlToFilePath(new_path);
    }catch(e){
        alert("adaptTutorLib. Ошибка 1. Ошибка при распаковке архива с курсом");
        return "";
    }    
}


/**
 * Возвращает уникальный код, присвоенный adaptlearning курсу. 
 * @param String course_path - путь к каталогу курса
 * @return String - код курса
 */
function get_code_from_path(course_path){
    if(StrMatchesPattern(course_path, '*\download.zip')){       
        var new_path = StrReplace(course_path, '\\download.zip', '');
        new_path = StrReplace(new_path, '/download.zip', '');
        var path_length = StrLen(new_path);
        for (var i = path_length; i >= 1; i--){
           if(StrCharRangePos(new_path, i, i+1) == '\\' || StrCharRangePos(new_path, i, i+1) == '/'){
                return StrRightRangePos(new_path, i+1);
            }
        }        
    }else{
        return '';
    }    
}


/**
 * Получает из файла манифеста название модуля
 * @param Strind manifest_path - путь к файлу манифеста
 * @return String - название курса 
 */
function get_module_data(manifest_path){
    var file = LoadFileData(manifest_path);
    return StrScan(file, '%*s<title><![CDATA[%s]]></title>%*s')[0];
}


/**
 * Создаёт новый модуль электронного курса
 * @param String course_path - путь к модулю, относительно папки /wt/web
 * @param String code - код курса
 * @param String module_name - название курса
 * @return Doc - документ модуля
 */
function create_module(course_path, code, module_name){
    var new_module = OpenNewDoc('x-local://wtv/wtv_course_module.xmd');
    new_module.TopElem.code = code;
    new_module.TopElem.name = module_name;
    new_module.TopElem.url = course_path+'/index.html';
    new_module.TopElem.set_status_side = 'course';
    new_module.BindToDb();
    new_module.Save();
    return new_module;
}


/**
 * Обновляет название модуля и возвращает его содержимое
 * @param Int module_id - идентификатор обновляемого модуля
 * @param String course_path - путь к модулю, относительно папки /wt/web
 * @param String code - код курса
 * @param String module_name - название курса 
 * @return Doc - документ модуля 
 */
function update_module(module_id, course_path, code, module_name){
    var module = OpenDoc(UrlFromDocID(module_id));
    module.TopElem.name = module_name;
    module.TopElem.code = code;
    module.TopElem.url = course_path+'/index.html';
    module.Save();
    return module;
}


/**
* Создаёт карточку модуля курса
* @param String course_path - путь к каталогу курса в WebTutor
* @param String code - уникальный код модуля
* @return Doc - документ модуля курса
*/
function get_or_create_module(course_path, code){
    var module_name = get_module_data(course_path + "\\imsmanifest.xml");
    //Относительный путь к курсу. Относительно папки /wt/web
    var relation_path = StrScan(FilePathToUrl(course_path), '%*s/wt/web%s')[0];
    var module = ArrayOptFirstElem(XQuery('for $elem in course_modules where $elem/code="'+code+'" return $elem'));
    if (module == undefined){        
        var module_doc = create_module(relation_path, code, module_name);
    }else{
        var module_doc = update_module(Int(module.id), relation_path, code, module_name);
    }
    return module_doc;    
}

/**
 * Создаёт новый электронный курс с единственным модулем - переданным в качестве параметра
 * @param Doc module - документ учебного модуля
 * @return Doc - документ курса
 */
function create_course(module){
    var course = OpenNewDoc('x-local://wtv/wtv_course.xmd');
    course.TopElem.name = module.TopElem.name;
    course.TopElem.code = module.TopElem.code;
    course.TopElem.import_type= 'scorm';
    course.TopElem.base_url = module.TopElem.url;
    course.BindToDb();
    course.Save();
    var part = course.TopElem.parts.AddChild();
    part.code = module.TopElem.code;
    part.name = module.TopElem.name;
    part.url = module.TopElem.url;
    part.course_module_id = module.DocID;
    part.set_status_side = module.TopElem.set_status_side;
    course.Save();
    return course;
}


/**
* Открывает и возвращает существующую или новую карточку электронного курса
* @param Doc module - документ модуля курса
* @return Doc course - документ курса
*/
function get_or_create_course(module){
    var course = ArrayOptFirstElem(XQuery('for $elem in courses where $elem/code="'+module.TopElem.code+'" return $elem'));
    if (course == undefined){
        var course_doc = create_course(module);
    }else{
        var course_doc = OpenDoc(UrlFromDocID(Int(course.id)));        
    }
    return course_doc;
}
