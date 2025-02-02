export default function UrlGenerator() {
    // Short code with a mix of letters and numbers 
    // Just lowercase for user ease 
    const lowerChars = "abcdefghijklmnopqrstuvwxyz"; 
    
    const lengthOfUrl = 5;
    let url = ""; 


    for (let i = 0; i < lengthOfUrl; i++){
        if (Math.floor(Math.random() * 2) == 0) {
            url += Math.floor(Math.random() * 10);
        } else {
            url += lowerChars[Math.floor(Math.random() * 26)];
        }
    }
    return url;
}