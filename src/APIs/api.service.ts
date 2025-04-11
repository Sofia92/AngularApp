/**
 * 本文件内容为API repository,输出原始后端返回DTO
 */
import { Injectable } from "@angular/core"
import { NetworkService } from "./network.service"

@Injectable({ providedIn: "root" })
export class OutpAPIService {
  constructor(private apiService: NetworkService) { }

  // 生成字符串的哈希值
  private hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
  }
}
