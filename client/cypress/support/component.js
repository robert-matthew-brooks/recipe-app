import './assertions';
import './commands';
import { mount } from 'cypress/react18';
import '../../src/App.css';

Cypress.Commands.add('mount', mount);
