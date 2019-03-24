// import { BaseGenerator, GeneratorOptions, InquirerQuestionType } from 'dotup-typescript-yeoman-generators';
// // import { TsQuestions, TypescriptGenerator } from '../ts/TypescriptGenerator';
// import globalModulesPath from 'global-modules-path';
// import inquirer = require('inquirer');
// import { TypeSaveProperty, Nested } from 'dotup-ts-types';

// type PartialYeomanQuestions = Partial<TypeSaveProperty<Nested<GitQuestions, string>>>;

// export class YeomanGeneratorGenerator extends BaseGenerator<TsQuestions> {

//   constructor(args: string | string[], options: GeneratorOptions<TsQuestions>) {
//     super(args, options);
//     this.registerMethod(this);

//     // Do not ejs this files
//     this.addSkipEjsReplacement(`src\\app\\templates\\package.json`);

//     const opt = <IProperty>this.options;

//     if (!opt.projectName.startsWith('generator-')) {
//       opt.projectName = `generator-${opt.projectName}`;
//       // this.destinationRoot(opt.projectName);
//     }

//     (<IProperty>this.answers).yoCli = globalModulesPath.getPath('yo').replace(/\\/g, '/');

//     this.writeOptionsToAnswers(TsQuestions);
//     // TODO: Extendable enum..
//     (<IProperty>this.answers).yoName = opt.projectName.replace('generator-', '');
//   }

//   async initializing(): Promise<void> {
//     const opt = <IProperty>this.options;
//     this.composeWith(
//       <any>{
//         Generator: TypescriptGenerator,
//         path: require.resolve('../ts/index')
//       },
//       {
//         [TsQuestions.projectName]: opt.projectName,
//         [TsQuestions.sourcePath]: opt.sourcePath,
//         [TsQuestions.targetPath]: opt.targetPath,
//         [TsQuestions.testPath]: opt.testPath,
//         [TsQuestions.docsPath]: opt.docsPath,
//         [TsQuestions.mainFile]: opt.mainFile,
//         [TsQuestions.typesFile]: opt.typesFile
//       }
//     );
//   }

//   async install(): Promise<void> {
//   }

//   async end(): Promise<void> {
//     this.logYellow('Should I run .');

//     const q = {
//       name: 'npmlink',
//       message: 'Should I run npm link for you? (To debug your generator)',
//       default: 'Y',
//       type: InquirerQuestionType.confirm
//     };

//     const result: ITypedProperty<boolean> = await inquirer.prompt(q);

//     if (result.npmlink === true) {
//       this.spawnCommandSync('npm', ['link']);
//     }
//   }
// }
