module walsafe_contract::file_storage;

use std::string::String;
use sui::event::emit;

public struct FileInfo has store, drop, copy {
    id: u64,
    uploader: address,
    file_name: String,
    iv_base64: String,
    signature: String,
    blobId: String,
}

/// File storage table
public struct FileTable has key, store {
    id: UID,
    files: vector<FileInfo>,
    counter: u64,
}

public struct FilesEvent has copy, drop, store {
    files: vector<FileInfo>,
}

/// Initialize file storage table
#[allow(lint(self_transfer))]
fun init(ctx: &mut TxContext) {
    let table_id = sui::object::new(ctx);
    let table = FileTable {
        id: table_id,
        files: vector::empty<FileInfo>(),
        counter: 0,
    };
    sui::transfer::share_object(table);
}

/// Upload file information to the chain
public fun upload_file(
    table: &mut FileTable,
    file_name: String,
    blobId: String,
    iv_base64: String,
    signature: String,
    ctx: &mut TxContext,
) {
    let file_info = FileInfo {
        id: table.counter,
        uploader: sui::tx_context::sender(ctx),
        file_name,
        iv_base64,
        signature,
        blobId,
    };
    vector::push_back(&mut table.files, file_info);
    table.counter = table.counter + 1;
}

/// Query file information by index: return directly
public fun get_file_info(table: &FileTable, index: u64): &FileInfo {
    vector::borrow(&table.files, index)
}

/// Delete file information (by index)
public fun delete_file(table: &mut FileTable, index: u64, ctx: &mut TxContext) {
    let file_info_ref = vector::borrow(&table.files, index);
    assert!(file_info_ref.uploader == sui::tx_context::sender(ctx), 1001);
    _ = vector::swap_remove(&mut table.files, index);
}

/// Get the length of the file table
public fun get_file_count(table: &FileTable): u64 {
    vector::length(&table.files)
}

/// Get all file information
/// Get all files uploaded by the caller
public fun get_all_files_by_caller(table: &FileTable, ctx: &TxContext) {
    let mut caller_files = vector::empty<FileInfo>();
    let len = vector::length(&table.files);
    let caller = sui::tx_context::sender(ctx);
    let mut i = 0;
    while (i < len) {
        let file_info = vector::borrow(&table.files, i);
        if (file_info.uploader == caller) {
            vector::push_back(&mut caller_files, *file_info);
        };
        i = i + 1;
    };
    let event = FilesEvent { files: caller_files };
    emit(event);
}
