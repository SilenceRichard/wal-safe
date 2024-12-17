module walsafe_contract::file_storage {

    /// 文件信息结构体：使用 drop 能力，使得返回值可被丢弃
    public struct FileInfo has store, drop {
        id: u64,                     // 文件的唯一数字ID
        encrypted: vector<u8>,       // 加密的文件内容标识符
        file_name: vector<u8>,       // 文件名
        iv_base64: vector<u8>,       // 初始化向量
        signature: vector<u8>,       // 文件签名
    }

    /// 文件存储表
    public struct FileTable has key, store {
        id: UID,                      // 对象ID
        files: vector<FileInfo>,      // 文件信息列表
        counter: u64,                 // 自增计数器，用于生成文件ID
    }

    /// 初始化文件存储表
    public fun init_storage(ctx: &mut TxContext): FileTable {
        let table_id = sui::object::new(ctx);
        FileTable {
            id: table_id,
            files: vector::empty<FileInfo>(),
            counter: 0,
        }
    }

    /// 上传文件信息到链上
    public fun upload_file(
        table: &mut FileTable,
        encrypted: vector<u8>,
        file_name: vector<u8>,
        iv_base64: vector<u8>,
        signature: vector<u8>,
        _ctx: &mut TxContext
    ) {
        let file_info = FileInfo {
            id: table.counter,
            encrypted,
            file_name,
            iv_base64,
            signature,
        };
        vector::push_back(&mut table.files, file_info);
        table.counter = table.counter + 1;
    }

    /// 根据索引查询文件信息
    public fun get_file_info(
        table: &FileTable,
        index: u64
    ): &FileInfo {
        vector::borrow(&table.files, index)
    }

    /// 删除文件信息（通过索引）
    public fun delete_file(
        table: &mut FileTable,
        index: u64
    ) {
        // 现在 FileInfo 有 drop 能力，可以安全丢弃返回值
        _ = vector::swap_remove(&mut table.files, index);
    }

    /// 获取文件表的长度
    public fun get_file_count(table: &FileTable): u64 {
        vector::length(&table.files)
    }

    /// 获取整个列表
    public fun get_all_files(table: &FileTable): &vector<FileInfo> {
        &table.files
    }
}
