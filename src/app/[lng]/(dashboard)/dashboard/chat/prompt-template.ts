export class PromptTemplate {
    private template: string;
  
    constructor(template: string) {
      this.template = template;
    }
  
    // Method to format the prompt with the current demand
    private formatPrompt(input: string): string {
      if (!input && input=='') {
        throw new Error('User Input is not set or empty.');
      }
  
      return this.template.replace('{input}', input);
    }
  
    // Method to get the formatted prompt
    getFormattedPrompt(input: string): string {
      return this.formatPrompt(input);
    }
  
    // Static method to create a default Prompt instance
    static createBuggyDefaultPromptTemplate(): PromptTemplate {
      const defaultTemplate = `
        You are an IT & Cloud architecture assistant. Your task is to generate an architecture diagram based on the following demand in <<<>>> represented in mermaid's syntax:
        When presented with the demand, come up with all the services and components necessary, list their respectives interactions.
        Afterward, combine all the information and generate a mermaid text-based diagram. Follow the step below

        <<<# Demand: {input}>>>
        Considering the demand above, follow the steps below to generate the required JSON output.

        # Instructions:
        ## List components:
        In clear and concise language, list components used in the architecture to adress the demand.
        Only list components that are usefull and correspond to infrastructure components. Don't add extra-services that are equivalents.

        ## List components interactions:
        Using the list of components generate their necessary interactions(read/write) to adress the demand.
        Make sure that it is technicaly possible and to only link components together that can and should interact together.

        ## Generate a Mermaid diagram:
        Using the list created before of components and their respectives interactions, create a text-based diagram representation of the architecture in Mermaid format with correct mermaid syntax.
        Make sure to only generate mermaid text diagram and nothing else. Make sure it is not malformed mermaid format.

        ## Add the list of components and the Mermaid text-based diagram into a short final JSON output:
        Place the result in a short JSON like this:
        \`\`\`json
        "components": ["Components A","Components B","Components C"]; "mermaid" : "InsertHereTheMermaidDiagramTextGeneratedAbove"
        \`\`\`
      `;
      return new PromptTemplate(defaultTemplate);
    }
    static createDiagramPromptTemplate(): PromptTemplate {
      const defaultTemplate = `
        You are an IT & Cloud architecture assistant. Your task is to generate an architecture diagram based on the following demand in <<<>>> represented in mermaid's syntax:
        When presented with the demand, come up with all the services and components necessary, list their respectives interactions.
        Afterward, combine all the information and generate a mermaid text-based diagram. Follow the step below

        <<<# Demand: {input}>>>
        Considering the demand above, follow the steps below to generate the required JSON output.

        # Instructions:
        ## List components:
        In clear and concise language, list components used in the architecture to adress the demand.
        Only list components that are usefull and correspond to infrastructure components. Don't add extra-services that are equivalents.

        ## List components interactions:
        Using the list of components generate their necessary interactions(read/write) to adress the demand.
        Make sure that it is technicaly possible and to only link components together that can and should interact together.

        ## Generate a Mermaid diagram:
        Using the list created before of components and their respectives interactions, create a text-based diagram representation of the architecture in Mermaid format with correct mermaid syntax.
        Make sure to only generate mermaid text diagram and nothing else. Make sure it is not malformed mermaid format.
      `;
      return new PromptTemplate(defaultTemplate);
    }
    static createMockTemplate(): PromptTemplate{
      const mock = `Please return the following JSON ==> {"components": ["Azure Web App", "Azure SQL Database", "Azure Blob Storage", "Azure Content Delivery Network (CDN)", "Azure Application Insights"], "mermaid": "graph LR\n A[Azure Web App] --- B[Azure SQL Database]\n A --- C[Azure Blob Storage]\n C --- D[Azure CDN]\n A --- E[Azure Application Insights]" }`;
      return new PromptTemplate(mock);
    }
  }
  

  