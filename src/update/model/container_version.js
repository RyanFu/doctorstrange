'use strict'

export default class extends think.model.base {
    init (...args) {
      super.init(...args);
      this.tableName = 'container_version';
    }


    /**
     * 根据批量的id查询到相应的原生container版本号
     * @method getContainerIdByIds
     * @param  {[type]}            ids [description]
     * @return {[type]}                [description]
     * @author jimmy
     */
    async getContainerIdByIds(ids){
        return await this.where({
            id: ['IN', ids],
            state: 1
        }).select();
    }

    /**
     * 根据appId获取当前app的所有原生版本号
     * @method getVersionListByAppId
     * @param  {[type]}              appId [description]
     * @return {[type]}                    [description]
     * @author jimmy
     */
    async getVersionListByAppId(appId){
        return await this.where({
            app_id: appId,
            state: 1
        }).select();
    }

    /**
     * 根据id获取版本信息
     * @method getVersionInfoById
     * @param  {[type]}           id [description]
     * @return {[type]}              [description]
     * @author jimmy
     */
    async getVersionInfoById(id){
        return await this.where({
            id: id,
            state: 1
        }).find();
    }

    /**
     * 添加原生版本
     * @method addContainerVersion
     * @param  {[type]}            data [description]
     * @author jimmy
     */
    async addContainerVersion(data){
        return await this.add({
          app_id: data.appId,
          major: data.major,
          minor: data.minor,
          patch: data.patch,
          bundle_id: data.bundleId,
          state: 1
        });
    }
}
