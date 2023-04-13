# 毕业设计-个人电商低码平台后台服务
docker build -t lowcode-platform-service:1.0.0 .
docker run -id --name lowcode-platform-service -v /images:/images -p 3300:3300 lowcode-platform-service:1.0.0