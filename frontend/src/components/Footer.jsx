import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const githubUrl = "https://github.com/prathamesonar";  

    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-12 py-6">
            <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm"> 
                <p>&copy; {currentYear} Fix4Ever. All rights reserved.</p>
                 
                <p className="mt-2">  
                    Developed by: {' '}  
                    <a
                        href={githubUrl}
                        target="_blank"  
                        rel="noopener noreferrer"  
                        className="text-blue-600 hover:underline"
                    >
                        Prathamesh Sonar 
                    </a>
                </p>
             </div>
        </footer>
    );
};

export default Footer;
