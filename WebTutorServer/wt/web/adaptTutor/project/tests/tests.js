<%

function test_main(){
    var src = 'x-local://wt/web/adaptTutor/project/tests/download.zip';
    var data = {'form':{'course_path':src}};
    var address = 'http://localhost/adaptTutor/endpoint.html';
    HttpRequest(address, 'post', data);

    var module = ArrayOptFirstElem(XQuery('for $elem in course_modules where $elem/name="Course title" return $elem'));
    if (module == undefined) {
        %><h1>Тест 1 не пройден</h1><%
    }

    var course = ArrayOptFirstElem(XQuery('for $elem in courses where $elem/name="Course title" return $elem'));
    if (course == undefined) {
        %><h1>Тест 2 не пройден</h1><%
    }
}

test_main();

%>