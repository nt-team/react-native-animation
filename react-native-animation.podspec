Pod::Spec.new do |s|
  s.name          = "react-native-animation"
  s.version       = "1.0.6"
  s.platform      = :ios, "8.0"
  s.authors       = { "Zhang Zhenyang" => "zhangzhenyang@baidu.com" }
  s.license       = "MIT"
  s.summary       = "A native animation UI component for react-native."
  s.homepage      = "https://github.com/zhang740/react-native-animation"
  s.source        = { :git => "https://github.com/zhang740/react-native-animation.git" }
  s.source_files = "ios/*.{h,m}"
  
  s.dependency 'React'
end
