module walsafe_contract::file_storage {

    /// 文件信息结构体：使用 drop 能力
    public struct FileInfo has store, drop {
        id: u64,
        uploader: address,
        encrypted: vector<u8>,
        file_name: vector<u8>,
        iv_base64: vector<u8>,
        signature: vector<u8>,
    }

    /// 文件存储表
    public struct FileTable has key, store {
        id: UID,
        files: vector<FileInfo>,
        counter: u64,
    }

    /// 定义事件，添加 copy 能力
    public struct FileInfoEvent has drop, copy {
        id: u64,
        uploader: address,
        encrypted: vector<u8>,
        file_name: vector<u8>,
        iv_base64: vector<u8>,
        signature: vector<u8>,
    }

    /// 初始化文件存储表
    #[allow(lint(self_transfer))]
    public fun init_storage(ctx: &mut TxContext) {
        let table_id = sui::object::new(ctx);
        let table = FileTable {
            id: table_id,
            files: vector::empty<FileInfo>(),
            counter: 0,
        };
        sui::transfer::transfer(table, sui::tx_context::sender(ctx));
    }

    /// 上传文件信息到链上
    public fun upload_file(
        table: &mut FileTable,
        encrypted: vector<u8>,
        file_name: vector<u8>,
        iv_base64: vector<u8>,
        signature: vector<u8>,
        ctx: &mut TxContext
    ) {
        let file_info = FileInfo {
            id: table.counter,
            uploader: sui::tx_context::sender(ctx),
            encrypted,
            file_name,
            iv_base64,
            signature,
        };
        vector::push_back(&mut table.files, file_info);
        table.counter = table.counter + 1;
    }

    /// 根据索引查询文件信息：通过事件返回
    public fun get_file_info(
        table: &FileTable,
        index: u64,
        _ctx: &mut TxContext
    ) {
        let file_info_ref = vector::borrow(&table.files, index);
        sui::event::emit(FileInfoEvent {
            id: file_info_ref.id,
            uploader: file_info_ref.uploader,
            encrypted: file_info_ref.encrypted,
            file_name: file_info_ref.file_name,
            iv_base64: file_info_ref.iv_base64,
            signature: file_info_ref.signature,
        });
    }

    /// 删除文件信息（通过索引）
    public fun delete_file(
        table: &mut FileTable,
        index: u64,
        ctx: &mut TxContext
    ) {
        let file_info_ref = vector::borrow(&table.files, index);
        assert!(file_info_ref.uploader == sui::tx_context::sender(ctx), 1001);
        _ = vector::swap_remove(&mut table.files, index);
    }

    /// 获取文件表的长度
    public fun get_file_count(table: &FileTable): u64 {
        vector::length(&table.files)
    }
}
