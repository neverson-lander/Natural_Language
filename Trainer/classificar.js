// Use python shell
var PythonShell = require('python-shell');

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFzc2lmeVRva2VuIjoiQ2xhc3NpZmljYWRvciBBdm9uIiwiaWF0IjoxNDk3ODk2MzkyfQ.iuNcuaCT7Yd4tmr3FjElpcG5TvWxx7wkJVN7zJb9PQ0'
var sentence = 'estou devendo';
var args = [token, sentence]


var myPythonScriptPath = 'Neural_Network_Classifier.py';
var options = {
	mode: 'text',
	scriptPath: '../Classifier',
    args: [token, sentence]
};


var pyshell = new PythonShell(myPythonScriptPath, options);
pyshell.send(JSON.stringify(args));

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err){
    	console.log('Ocorreu um erro durante o treinamento!');
        //throw err;
    };

    console.log('Acabou');
});