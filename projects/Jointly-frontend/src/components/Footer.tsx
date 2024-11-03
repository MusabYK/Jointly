import React from 'react';

const Footer = () => {
    const currentYear = new Date()
    let year = currentYear.getFullYear()
    return (
        <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-gray-400">
            <div>
              <h4 className="text-white font-semibold mb-4">About Us</h4>
              <p>Building the future of decentralized finance through innovative joint account management solutions.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-purple-400">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400">FAQs</a></li>
                <li><a href="#" className="hover:text-purple-400">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-purple-400">Twitter</a>
                <a href="#" className="hover:text-purple-400">Discord</a>
                <a href="#" className="hover:text-purple-400">GitHub</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {year} Jointly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer;