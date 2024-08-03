export const buildMermaidDiagramPrompt = (input: string): string => {
  const JSON_SCHEMAS = `{
    "GenerateMermaidDiagram": { "mermaidGraph" : string }
  }`;

  return `
    You are an IT & Cloud architecture assistant. Your task is to generate an architecture diagram based or any graph based on the following demand in <<<>>> represented in mermaid's syntax:
    When presented with the demand, come up with all the services and components necessary, list their respectives interactions.
    Afterward, combine all the information and generate a mermaid text-based diagram. Follow the step below

    <<<# Demand: ${input}>>>
    Considering the demand above, follow the steps below to generate the required JSON output, The JSON schema should include: ${JSON_SCHEMAS}.

    # Instructions:

    ## Generate a Mermaid diagram:
    Using the list created before of components and their respectives interactions, create a text-based diagram representation of the architecture in Mermaid format with correct mermaid syntax.
    Make sure to only generate mermaid text diagram and nothing else. Make sure it is not malformed mermaid format.
  `;
};
