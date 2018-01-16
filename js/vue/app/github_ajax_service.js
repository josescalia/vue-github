new Vue({
    el: "#vueApp",
    data: {
        gitHubApiUrl: "https://api.github.com", //default github api url
        gitHubUserName: "josescalia", //default is me

        //github object api
        gitHubUserInfo: {},
        gitHubUserRepo: {},
        gitHubUserRepoList:[],
    },
    mounted:function(){
         this.getGitHubUserInfo();
    },
    methods: {
        //utility
        formatDate: function (v) {
            return moment(v.replace(/T|Z/g, ' ')).format("DD MMM YYYY HH:mm:ss a");
        },

        /*getGithub UserFunction*/
        getGitHubUserInfo: function () {
            let gitHubUrl = this.gitHubApiUrl + "/users/" + this.gitHubUserName;
            this.$http.get(gitHubUrl).then(response => {
                this.gitHubUserInfo = response.body;
                this.gitHubUserInfo.created_at = this.formatDate(this.gitHubUserInfo.created_at);
                this.gitHubUserInfo.updated_at = this.formatDate(this.gitHubUserInfo.updated_at);
                //if success get repo list of user
                this.getGitHubRepoList();
                },response =>{
                    //error callback
                    alert("The user is " + response.body.message + " on github");
                }
            );
        },

        getGitHubRepoList:function () {
            let gitHubUrl = this.gitHubApiUrl + "/users/" + this.gitHubUserName + "/repos";
            this.$http.get(gitHubUrl).then(response => {
                this.gitHubUserRepoList = response.body;
            });
        }

    }
});