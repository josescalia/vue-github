new Vue({
    el: "#vueApp",
    data: {
        gitHubApiUrl: "https://api.github.com", //default github api url
        gitHubUserName: "josescalia", //default is me
        gitHubToken : "YOUR_GITHUB_PERSONAL_ TOKEN",
        reqHeader:{},
        loading: true,
        //github object api
        gitHubUserInfo: {},
        gitHubUserRepo: {},
        gitHubUserRepoList: [],

        //pagination
        dataPerPage: 10,
        currPage: 1,
        next: 0,
        prev: 0,
        numOfPage: 0,
        totalData: 0
    },
    mounted: function () {
        let authorization = "token " + this.gitHubToken;
        this.reqHeader = {headers: {"Authorization":authorization}};
        this.getGitHubUserInfo();

    },
    methods: {
        //utility
        formatDate: function (v) {
            return moment(v.replace(/T|Z/g, ' ')).format("DD MMM YYYY HH:mm:ss a");
        },

        /*getGithub UserFunction*/
        getGitHubUserInfo: function () {
            $("#modalLoading").modal("show");
            let gitHubUrl = this.gitHubApiUrl + "/users/" + this.gitHubUserName;
            this.$http.get(gitHubUrl,this.reqHeader).then(response => {
                    this.gitHubUserInfo = response.body;
                    this.gitHubUserInfo.created_at = this.formatDate(this.gitHubUserInfo.created_at);
                    this.gitHubUserInfo.updated_at = this.formatDate(this.gitHubUserInfo.updated_at);
                    //if success get repo list of user
                    this.getGitHubRepoList(this.currPage);
                    this.totalData = this.gitHubUserInfo.public_repos;
                    this.numOfPage = this.getNumPage();

                }, response => {
                    //error callback
                    alert("The user is " + response.body.message + " on github");
                    $("#modalLoading").modal("hide");
                }
            );
        },

        getGitHubRepoList: function (page) {
            $("#modalLoading").modal("show");
            let gitHubUrl = this.gitHubApiUrl + "/users/" + this.gitHubUserName + "/repos?per_page=" + this.dataPerPage + "&page=" + page;
            this.$http.get(gitHubUrl,this.reqHeader).then(response => {
                this.gitHubUserRepoList = response.body;
                $("#modalLoading").modal("hide");
                this.createPaging(page);

            });
        },


        createPaging: function (page) {
            this.currPage = page;
            this.prev = page -1;
            this.next = page + 1;
        },

        getNumPage: function () {
            return Math.ceil(this.gitHubUserInfo.public_repos / this.dataPerPage);
        }


    }
});