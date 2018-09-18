var txtMemory, memory, letters, numbers, btmInsert, strChars, dwScope, scope, delay, value1, value2, btnPut, btnStart, btnClear, inCode; // Variables

/*
	Funtions
*/

function Init(){
	
	// Html objects
	txtMemory = document.createElement('p');
	txtMemory.style = "text-align: center; top: 32px; font-size: 20px;"
	txtMemory.style.fontFamily = "Courier New";
	
	btnPut = document.createElement('button');
	btnPut.style = "position: absolute; top: 256px;"
	btnPut.style.left = (window.innerWidth/2 - 0) + "px";
	btnPut.innerHTML = "Put this code inside there";
	btnPut.onclick = function() {PutCode()};
	
	btnStart = document.createElement('button');
	btnStart.style = "position: absolute; top: 256px;"
	btnStart.style.left = (window.innerWidth/2 - 64) + "px";
	btnStart.innerHTML = "Start";
	btnStart.onclick = function() { scope = 0; dwScope = 0; CharsUpdate(); setTimeout(Computing(), delay); };
	
	btnClear = document.createElement('button');
	btnClear.style = "position: absolute; top: 256px;"
	btnClear.style.left = (window.innerWidth/2 - 128) + "px";
	btnClear.innerHTML = "Clear";
	btnClear.onclick = function() {Clear()};
	
	inCode = document.createElement('input');
	inCode.setAttribute("type", "text");
	inCode.style = "position: absolute; top: 328px;"
	inCode.style.left = (window.innerWidth/2 - 176) + "px";
	inCode.size = "50";
	
	// Appends
	document.body.appendChild(txtMemory);
	document.body.appendChild(btnPut);
	document.body.appendChild(btnStart);
	document.body.appendChild(btnClear);
	document.body.appendChild(inCode);
	
	// Variables
	memory = new Array(256);
	letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f"];
	numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	strChars = new Array(memory.length);
	dwScope = 0;
	value1 = 0;
	value2 = 0;
	delay = 200;
	
	// Clear
	Clear();
}

function Display(){
	
	var strDisplay = "";
	
	for(var i = 0; i < memory.length; i++){
		
		if ( (i % 16) < 15 ){
			strDisplay += strChars[i] // Middle
		}else{
			if ( (i % 32) == 31 ){
				strDisplay += strChars[i] + "<br>"; // Enter
			} else {
				strDisplay += strChars[i] + "&nbsp;&nbsp;&nbsp;&nbsp;"; // Big space
			}
		}
		
	}
	
	txtMemory.innerHTML = strDisplay;
	
}

function CharsUpdate(){
	for(var i = 0; i < memory.length; i++){
		
		var num = memory[i];
		//if ( num < 0 ){ num += 256; }
		
		var hexChar =
			letters[ Math.floor(num / 16) ] +
			letters[ num % 16 ];
			
		
		if ( i == dwScope ){
			strChars[i] = "(" + hexChar + ")"; // Scope
		}else{
			strChars[i] = "&nbsp" + hexChar + "&nbsp"; // Space &nbsp
		}
	}
	
	Display();
	
}

function PutCode(){ // Put the code from input to memory
	
	var str = inCode.value; // Input string	
	var char1 = ''; // First temporary char	
	var i = 0; // Address counter
	
	for(var s = 0; s < str.length; s++){ // Input string counter
	for(var j = 0; j < letters.length; j++){ // Test letters
	if ( str.charAt(s) == letters[j] ){ // If char is a "letter"
	
		if ( (i%2) == 0 ){	char1 = str.charAt(s); }
		else{ memory[(i-1)/2] = ByteToDec(char1, str.charAt(s)); }
		
		i++;
		
		break;	
	}}}
	
	// Updates the code
	CharsUpdate();
	
}

function Clear(){
	for (var i = 0; i < memory.length; i++){
		
		memory[i] = 0;
		strChars[i] = "&nbsp00&nbsp";
		
	}
	
	CharsUpdate();
}

function ByteToDec(hex1, hex2){
	
	var num = 0;
	
	for(var i = 0; i < 16; i++){ // Tests all letters
		if ( letters[i] == hex1 ){ // First hex
			num += numbers[i]*16;
		}
		if ( letters[i] == hex2 ){ // Second hex
			num += numbers[i];
		}
	}
	
	for(var i = 16; i < 22; i++){ // Tests all letters
		if ( letters[i] == hex1 ){ // First hex
			//alert("1");
			num += numbers[i-6]*16;
		}
		if ( letters[i] == hex2 ){ // Second hex
			//alert("2");
			num += numbers[i-6];
		}
	}
	
	//if ( num > 127 ){
	//	num -= 256;
	//}
	
	return num;
}

function Computing(){
	
	switch(memory[scope]){
		case 0:
			End();
			break;
		case 1:
			setTimeout(Write(), delay);
			break;
		case 2:
			setTimeout(Overwrite(), delay);
			break;
		case 3:
			setTimeout(Read(), delay);
			break;
		case 33:
			setTimeout(Sum(), delay);
			break;
		default:
			End();
			break;
	}
	
}

/*
	Computing functions
*/

function End(){
	
	scope = 0;
	dwScope = 0;
	CharsUpdate(); // scope returns to default address
	value1 = 0;
	value2 = 0;
	
}

function Write(){
	
	value1 = memory[(scope+1) %256]; // Stores the value1
	value2 = memory[(scope+2) %256]; // Stores the value2
	
	dwScope = (dwScope + 1) %256; // scope on value1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = (dwScope + 1) %256; // scope on value2
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value2; // scope on address
	CharsUpdate();
	setTimeout( function() {
	
	memory[value2] = value1; // Change value
	CharsUpdate();
	setTimeout( function() {
	
	scope = (scope + 3) %256; 
	dwScope = scope; // scope returns
	CharsUpdate();
	setTimeout( function() {Computing();}, delay);
	}, delay);}, delay);}, delay);}, delay);
	
}

function Overwrite(){
	
	value1 = memory[(scope+1) %256]; // Stores the value1
	value2 = memory[(scope+2) %256]; // Stores the value2
	
	dwScope = (dwScope + 1) %256; // scope on value1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = (dwScope + 1) %256; // scope on value2
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value1; // scope on address1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value2; // scope on address2
	CharsUpdate();
	setTimeout( function() {
	
	memory[value2] = memory[value1]; // Change value
	CharsUpdate();
	setTimeout( function() {
	
	scope = (scope + 3) %256;
	dwScope = scope; // scope returns
	CharsUpdate();
	setTimeout( function() {Computing();}, delay);
	}, delay);}, delay);}, delay);}, delay);}, delay);
	
}

function Read(){
	
	value1 = memory[(scope+1) %256]; // Stores the value1
	value2 = memory[(scope+2) %256]; // Stores the value2
	
	dwScope = (dwScope + 1) %256; // scope on value1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = (dwScope + 1) %256; // scope on value2
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value1; // scope on address1
	CharsUpdate();
	setTimeout( function() {
	
	if ( memory[value1] != 0 ){
		scope = value2;
	}else{
		scope = (scope + 3) %256;
	}
	dwScope = scope; // If address1 is 01, then scope goes to value2
	CharsUpdate();
	setTimeout( function() {Computing();}, delay);
	}, delay);}, delay);}, delay);
}

function Sum(){
	
	value1 = memory[(scope+1) %256]; // Stores the value1
	value2 = memory[(scope+2) %256]; // Stores the value2
	
	dwScope = (dwScope + 1) %256; // scope on value1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = (dwScope + 1) %256; // scope on value2
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value1; // scope on address1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value2; // scope on address2
	CharsUpdate();
	setTimeout( function() {
	
	memory[value2] = (memory[value2] + memory[value1]) %256; // Change value
	CharsUpdate();
	setTimeout( function() {
	
	scope = (scope + 3) %256;
	dwScope = scope; // scope returns
	CharsUpdate();
	setTimeout( function() {Computing();}, delay);
	}, delay);}, delay);}, delay);}, delay);}, delay);
	
}

function Invert(){

	value1 = memory[(scope+1) %256]; // Stores the value1. 00 = 2 complement. !00 = 2 complement - 1
	value2 = memory[(scope+2) %256]; // Stores the value2. Address
	
	dwScope = (dwScope + 1) %256; // scope on value1
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = (dwScope + 1) %256; // scope on value2
	CharsUpdate();
	setTimeout( function() {
	
	dwScope = value2; // scope on address2
	CharsUpdate();
	setTimeout( function() {
	
	if(value1 != 0){ memory[value2]--; }
	memory[value2] = (-memory[value2]) %256;
	CharsUpdate();
	setTimeout( function() {
	
	scope = (scope + 3) %256;
	dwScope = scope; // scope returns
	CharsUpdate();
	setTimeout( function() {Computing();}, delay);
	}, delay);}, delay);}, delay);}, delay);
	
}

// Main

Init();

alert("working"); // Another test
