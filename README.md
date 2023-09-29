# bunnycdn-storage-deploy


## Storage-Deploy

This action performs 3 operations.
* Uploads files and folders to storage.
* Removes all the files from storage.
* Purges pull zone.

Each operation can be activated with their respective upload, remove and purge flags.

### Inputs

| Name | Description |
| --- | --- |
| `upload` | It will upload files and folders if "true" provided. source, storageZoneName and storagePassword inputs should be provided. |
| `remove` | It will remove all the files from storage before uploading if "true" provided. storageZoneName and storagePassword inputs should be provided. |
| `purgePullZone` | It will purge the pull zone if "true" provided. pullZoneId and accessKey inputs should be provided. |
| `source` | The source directory that should be uploaded. |
| `destination` | The destination directory that should be uploaded too in the bunny storage zone. (Example: www). The destination should not end with `/` as in `www/`. |
| `storageZoneName` | The name of storage zone where you are connecting to. |
| `storageEndpoint` | The storage endpoint. Default value is storage.bunnycdn.com |
| `storagePassword` | The storage password. It should be read and write capable. |
| `accessKey` | The API key. |
| `pullZoneId` | Pull zone ID. |

### Example usage

```
- name: Deploy to BunnyCDN
  uses: ayeressian/bunnycdn-storage-deploy@v2.1.1
  with:
    source: "dist"
    destination: "www"
    storageZoneName: "${{ secrets.STORAGE_NAME }}"
    storagePassword: "${{ secrets.STORAGE_PASSWORD }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
    pullZoneId: "${{ secrets.ZONE_ID }}"
    upload: "true"
    remove: "true"
    purgePullZone: "true"
```

## Create storage

This actions creates a bunny storage

### Inputs

| Name | Description |
| --- | --- |
| `name` | The name of the storage zone. |
| `region` | The code of the main storage zone region (Possible values: DE, NY, LA, SG). |
| `replicationRegions` | The code of the main storage zone region (Possible values: DE, NY, LA, SG, SYD). Values should be separated by comma. Take care not to include the region. |
| `zoneTier` | The zone tier (0 = Standard, 1 = Edge). |
| `accessKey` | The API key. |

### Outputs

| Name | Description |
| --- | --- |
| `storageZoneId` | The storage zone id. |
| `storageZoneName` | The storage zone name. |
| `storageZonePassword` | The storage password. It should be read and write capable. |

### Example usage

```
- name: Create storage in BunnyCDN
  id: createStorage
  uses: ayeressian/bunnycdn-storage-deploy/createStorage@v2.1.1
  with:
    name: new-storage
    region: DE
    replicationRegions: DE,LA
    zoneTier: 1
    accessKey: "${{ secrets.STORAGE_KEY }}"
```

The output can be used in the next job using: ${{ steps.createStorage.outputs.storageZonePassword }}

## Update storage zone for a pull zone 

Github actions that can update an existing pull zone to use a different storage zone.

### Inputs

| Name | Description |
| --- | --- |
| `pullZoneId` | The pull zone id. |
| `storageZoneId` | The new storage zone id. |
| `accessKey` | The API key. |

### Example usage

```
- name: Update storage zone for a pull zone 
  uses: ayeressian/bunnycdn-storage-deploy/pullZoneChangeStorage@v2.1.1
  with:
    pullZoneId: "${{ secrets.ZONE_ID }}"
    storageZoneId: "${{ steps.createStorage.outputs.storageZoneId }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
```

## Purge a pull zone

Github actions that can purge a pull zone.

### Inputs

| Name | Description |
| --- | --- |
| `pullZoneId` | The pull zone id. |
| `accessKey` | The API key. |

### Example usage

```
- name: Purge the pull zone 
  uses: ayeressian/bunnycdn-storage-deploy/purge@v2.1.1
  with:
    pullZoneId: "${{ secrets.ZONE_ID }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
```
