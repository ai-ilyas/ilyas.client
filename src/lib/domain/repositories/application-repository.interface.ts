import { Application } from "../entities/application";
import { RepositoryInterface } from "./repository.interface";

export interface IApplicationRepository extends RepositoryInterface<Application>
{
}