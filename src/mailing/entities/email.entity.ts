export class Email {
  id: string;
  destination: string;
  variables?: Record<string, string>;

  constructor(
    id: string,
    destination: string,
    variables?: Record<string, string>,
  ) {
    this.id = id;
    this.destination = destination;
    this.variables = variables;
  }
}
