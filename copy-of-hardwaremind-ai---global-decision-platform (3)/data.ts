// 统一出口：向后兼容现有的 `../data` 导入路径`
// 明确指向目录下的 index，避免与当前文件同名导致的解析冲突
export * from './data/index';