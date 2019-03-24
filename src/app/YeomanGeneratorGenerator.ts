import { BaseGenerator, GeneratorOptions, SharedOptions, Question, InquirerQuestionType, IProperty, ProjectType, ConfirmQuestion, StoreQuestion } from 'dotup-typescript-yeoman-generators';
import _ from 'lodash';
import { TypescriptGenerator } from 'generator-dotup-typescript/generators/ts/TypescriptGenerator';
import { TypescriptQuestions } from 'generator-dotup-typescript/generators/ts/TypescriptQuestions';
import validateNpmPackageNameTyped from 'validate-npm-package-name-typed';
import globalModulesPath from 'global-modules-path';
import { YeomanGeneratorGeneratorQuestions } from './YeomanGeneratorGeneratorQuestions';

export class YeomanGeneratorGenerator extends BaseGenerator<YeomanGeneratorGeneratorQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<YeomanGeneratorGeneratorQuestions>) {
    super(args, _.merge(options, { 'sharedOptions': new SharedOptions() }));
    super.registerMethod(this);
    this.writeOptionsToAnswers(YeomanGeneratorGeneratorQuestions);
    this.destinationRoot(this.destinationPath());

    // Do not ejs this files
    this.addSkipEjsReplacement(`src\\app\\templates\\package.json`);

    (<IProperty>this.answers).yoCli = globalModulesPath.getPath('yo').replace(/\\/g, '/');
  }

  async initializing(): Promise<void> {

    // Project name
    this.addQuestion(
      new Question(YeomanGeneratorGeneratorQuestions.projectName, {
        message: 'Project Name',
        type: InquirerQuestionType.input,
        default: this.getDefaultProjectName(),
        validate: (v: string) => {
          if (!v.startsWith('generator-')) {
            v = `generator-${v}`;
            this.logRed(`Generators musst start with 'generator-'. Use ${v}`);
            return false;
          }

          return this.validateString(v);
        },
        acceptAnswer: v => {
          // TODO: Extendable enum..
          (<IProperty>this.answers).yoName = v.toString().replace('generator-', '');
          return true;
        }
      })
    );

    // Invalid project name
    this.addQuestion(
      new Question(YeomanGeneratorGeneratorQuestions.invalidProjectName, {
        message: 'Continue anyway?',
        type: InquirerQuestionType.confirm,
        default: 'N',
        acceptAnswer: accepted => {

          if (!accepted) {
            // Ask again for the project name
            this.currentStep = YeomanGeneratorGeneratorQuestions.projectName;
          }

          return accepted;
        },
        When: () => {
          const name = this.tryGetAnswer(YeomanGeneratorGeneratorQuestions.projectName);
          return !validateNpmPackageNameTyped(name).validForNewPackages;
        }
      })
    );

    // Create folder?
    this.addQuestion(
      new Question(YeomanGeneratorGeneratorQuestions.createFolder, {
        type: InquirerQuestionType.confirm,
        message: () => `Create folder '${this.answers.projectName}' ?`,
        default: 'Y',
        When: () => !this.destinationIsProjectFolder(this.answers.projectName),
        acceptAnswer: accepted => {
          if (accepted) {
            // Create new root
            this.destinationRoot(this.destinationPath(this.answers.projectName));
            this.logGreen(`Destination path changed to ${this.destinationPath()}`);
          }

          return accepted;
        }
      })
    );

    this.addQuestion(
      new ConfirmQuestion(YeomanGeneratorGeneratorQuestions.useGit, 'Configure git?')
    );

    // Use github?
    this.addQuestion(
      new StoreQuestion(YeomanGeneratorGeneratorQuestions.useGithub, {
        type: InquirerQuestionType.confirm,
        message: 'Configure github?',
        When: _ => this.answers.useGit.toString() === 'true'
      })
    );
  }

  async prompting(): Promise<void> {
    if (this.skipGenerator) { return; }

    await super.prompting();

    this.compose('generator-dotup-npm-package/generators/app');
    this.compose(
      'generator-dotup-typescript/generators/ts',
      true,
      {
        [TypescriptQuestions.projectType]: ProjectType.app,
        [TypescriptQuestions.sourcePath]: 'src',
        [TypescriptQuestions.targetPath]: 'generators',
        [TypescriptQuestions.testPath]: 'test',
        [TypescriptQuestions.docsPath]: 'docs'
      }
    );

    if (this.answers.useGit.toString() === 'true') {
      // TODO: remove rootPath
      // (<any>this.answers).rootPath = this.destinationPath(),
      this.compose('generator-dotup-git/generators/app');
    }

    if (this.answers.useGithub && this.answers.useGithub.toString() === 'true') {
      // Load git generator
      this.compose('generator-dotup-github/generators/app');
    }
    // Typescript generator
    // this.composeWith(
    //   <any>{
    //     Generator: TypescriptGenerator,
    //     path: require.resolve('../ts/index')
    //   },
    //   {
    //     [TypescriptQuestions.sourcePath]: 'src',
    //     [TypescriptQuestions.targetPath]: 'generators',
    //     [TypescriptQuestions.testPath]: 'test',
    //     [TypescriptQuestions.docsPath]: 'docs'
    //   }
    // );


    // case ProjectType.ts_yo_generator:

    //   this.composeWith(
    //     <any>{
    //       Generator: YeomanGeneratorGenerator,
    //       path: require.resolve('../ts-yogen/index')
    //     },
    //     {
    //       [TsQuestions.projectName]: this.answers.projectName,
    //       [TsQuestions.sourcePath]: 'src',
    //       [TsQuestions.targetPath]: 'generators',
    //       [TsQuestions.testPath]: 'test',
    //       [TsQuestions.docsPath]: 'docs',
    //       [TsQuestions.mainFile]: 'app/index.js',
    //       [TsQuestions.typesFile]: 'app/index.d.ts'
    //     }
    //   );

    //   break;

  }

}
